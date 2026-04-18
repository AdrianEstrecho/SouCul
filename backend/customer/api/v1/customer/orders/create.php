<?php
/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

// POST /api/v1/customer/orders

$auth = requireAuth();
$userId = $auth['user_id'] ?? null;

if (!$userId) {
    error('User authentication failed', 401);
}

$body = getBody();
requireFields($body, ['shipping_address', 'shipping_city', 'shipping_province', 'payment_method']);

$db = getDB();

$rawDirectItem = is_array($body['direct_item'] ?? null) ? $body['direct_item'] : null;
$checkoutItems = [];
$usesDirectCheckoutItem = false;

if ($rawDirectItem) {
    $directProductId = (int) ($rawDirectItem['product_id'] ?? $rawDirectItem['id'] ?? 0);
    $directQuantity = (int) ($rawDirectItem['quantity'] ?? $rawDirectItem['qty'] ?? 0);

    if ($directProductId <= 0) {
        error('Invalid direct checkout product.', 422);
    }

    if ($directQuantity <= 0) {
        error('Invalid direct checkout quantity.', 422);
    }

    $productStmt = $db->prepare("
        SELECT p.id as product_id, p.name, p.price, p.discount_price, p.quantity_in_stock
        FROM products p
        WHERE p.id = ? AND p.is_active = 1
        LIMIT 1
    ");
    $productStmt->execute([$directProductId]);
    $product = $productStmt->fetch();

    if (!$product) {
        error('Direct checkout product not found.', 404);
    }

    $stock = max(0, (int) ($product['quantity_in_stock'] ?? 0));
    if ($stock <= 0) {
        error('Direct checkout product is out of stock.', 422);
    }

    if ($directQuantity > $stock) {
        error('Direct checkout quantity exceeds available stock.', 422);
    }

    $checkoutItems[] = [
        'quantity' => $directQuantity,
        'price' => $product['price'],
        'discount_price' => $product['discount_price'],
        'name' => $product['name'],
        'product_id' => (int) $product['product_id'],
    ];
    $usesDirectCheckoutItem = true;
} else {
    // Get cart items
    $stmt = $db->prepare("
        SELECT ci.quantity, p.price, p.discount_price, p.name, p.id as product_id, p.quantity_in_stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ? AND p.is_active = 1
    ");
    $stmt->execute([$userId]);
    $checkoutItems = $stmt->fetchAll();

    if (empty($checkoutItems)) {
        error('Cart is empty', 400);
    }
}

foreach ($checkoutItems as $item) {
    $quantity = (int) ($item['quantity'] ?? 0);
    if ($quantity <= 0) {
        error('Invalid item quantity in checkout.', 422);
    }

    $stock = max(0, (int) ($item['quantity_in_stock'] ?? 0));
    if ($stock < $quantity) {
        $productName = (string) ($item['name'] ?? 'a product');
        error("Insufficient stock for {$productName}.", 422);
    }
}

// Calculate total
$subtotal = 0;
foreach ($checkoutItems as $item) {
    $price = $item['discount_price'] ?? $item['price'];
    $subtotal += $price * $item['quantity'];
}

// Generate order number
$orderNumber = 'ORD-' . strtoupper(uniqid());

$paymentMethod = strtolower(trim((string) ($body['payment_method'] ?? '')));
$isCashOnDelivery = in_array($paymentMethod, ['cod', 'cash_on_delivery', 'cash on delivery'], true);
$initialStatus = $isCashOnDelivery ? 'cash_on_delivery_requested' : 'online_payment_requested';

$normalizedPaymentMethod = match ($paymentMethod) {
    'cod', 'cash_on_delivery', 'cash on delivery' => 'cod',
    'gcash' => 'gcash',
    'bank', 'bank_transfer', 'bank transfer' => 'bank_transfer',
    'paypal' => 'paypal',
    'debit_card', 'debit card' => 'debit_card',
    default => 'credit_card',
};

$initialPaymentStatus = 'pending';

$voucherCode = strtoupper(trim((string) ($body['voucher_code'] ?? '')));
$voucher = null;
$voucherDiscountAmount = 0.0;
$totalAmount = (float) $subtotal;

if ($voucherCode !== '') {
    $voucherStmt = $db->prepare(
        "SELECT id, code, discount_type, discount_value, min_purchase_amount,
                max_discount_amount, usage_limit, usage_count, per_user_limit,
                valid_from, valid_until, status
         FROM vouchers
         WHERE code = ?
         LIMIT 1"
    );
    $voucherStmt->execute([$voucherCode]);
    $voucher = $voucherStmt->fetch();

    if (!$voucher) {
        error('Voucher code is invalid.', 422);
    }

    $voucherStatus = strtolower(trim((string) ($voucher['status'] ?? 'inactive')));
    if ($voucherStatus !== 'active') {
        error('Voucher is not active.', 422);
    }

    $today = date('Y-m-d');
    $validFrom = (string) ($voucher['valid_from'] ?? '');
    $validUntil = (string) ($voucher['valid_until'] ?? '');
    if ($validFrom !== '' && $today < $validFrom) {
        error('Voucher is not yet valid.', 422);
    }
    if ($validUntil !== '' && $today > $validUntil) {
        error('Voucher has already expired.', 422);
    }

    $minPurchaseAmount = max(0, (float) ($voucher['min_purchase_amount'] ?? 0));
    if ($subtotal < $minPurchaseAmount) {
        error('Order does not meet the minimum amount required by this voucher.', 422);
    }

    $usageLimit = isset($voucher['usage_limit']) ? (int) $voucher['usage_limit'] : null;
    $usageCount = (int) ($voucher['usage_count'] ?? 0);
    if ($usageLimit !== null && $usageLimit > 0 && $usageCount >= $usageLimit) {
        error('Voucher usage limit has been reached.', 422);
    }

    $perUserLimit = isset($voucher['per_user_limit']) ? (int) $voucher['per_user_limit'] : null;
    if ($perUserLimit !== null && $perUserLimit > 0) {
        $perUserStmt = $db->prepare(
            "SELECT COUNT(*)
             FROM orders
             WHERE user_id = ?
               AND customer_notes LIKE ?
               AND status <> 'cancelled'"
        );
        $perUserStmt->execute([$userId, '%Voucher code: ' . $voucher['code'] . '%']);
        $perUserUsage = (int) $perUserStmt->fetchColumn();
        if ($perUserUsage >= $perUserLimit) {
            error('You have reached the maximum number of uses for this voucher.', 422);
        }
    }

    $discountType = strtolower((string) ($voucher['discount_type'] ?? 'percentage'));
    $discountValue = max(0, (float) ($voucher['discount_value'] ?? 0));

    if ($discountType === 'fixed') {
        $voucherDiscountAmount = min($subtotal, $discountValue);
    } else {
        $voucherDiscountAmount = $subtotal * ($discountValue / 100);
        $maxDiscountAmount = isset($voucher['max_discount_amount'])
            ? (float) $voucher['max_discount_amount']
            : null;
        if ($maxDiscountAmount !== null && $maxDiscountAmount > 0) {
            $voucherDiscountAmount = min($voucherDiscountAmount, $maxDiscountAmount);
        }
    }

    $voucherDiscountAmount = max(0, min($subtotal, round($voucherDiscountAmount, 2)));
    if ($voucherDiscountAmount <= 0) {
        error('Voucher does not provide a discount for this order.', 422);
    }

    $totalAmount = max(0, round($subtotal - $voucherDiscountAmount, 2));
}

try {
    $db->beginTransaction();

    $orderCustomerNotes = null;
    if ($voucher) {
        $orderCustomerNotes = 'Voucher code: ' . $voucher['code'] . ' | Discount: ' . number_format($voucherDiscountAmount, 2, '.', '');
    }

    $decrementStmt = $db->prepare(
        "UPDATE products
         SET quantity_in_stock = quantity_in_stock - ?
         WHERE id = ? AND is_active = 1 AND quantity_in_stock >= ?"
    );

    foreach ($checkoutItems as $item) {
        $quantity = max(0, (int) ($item['quantity'] ?? 0));
        $productId = (int) ($item['product_id'] ?? 0);
        if ($productId <= 0 || $quantity <= 0) {
            throw new RuntimeException('Invalid checkout item.');
        }

        $decrementStmt->execute([$quantity, $productId, $quantity]);
        if ($decrementStmt->rowCount() !== 1) {
            $productName = (string) ($item['name'] ?? ('Product #' . $productId));
            throw new RuntimeException("Insufficient stock for {$productName}.");
        }
    }

    // Create order
    $stmt = $db->prepare(" 
        INSERT INTO orders (order_number, user_id, status, subtotal, total_amount,
                           shipping_address, shipping_city, shipping_province, shipping_phone, customer_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $orderNumber,
        $userId,
        $initialStatus,
        $subtotal,
        $totalAmount,
        $body['shipping_address'],
        $body['shipping_city'],
        $body['shipping_province'],
        $body['shipping_phone'] ?? null,
        $orderCustomerNotes,
    ]);

    $orderId = $db->lastInsertId();

    // Create initial payment record so payment status is visible immediately.
    try {
        $paymentStmt = $db->prepare("\n            INSERT INTO payments (order_id, payment_method, payment_status, amount)\n            VALUES (?, ?, ?, ?)\n        ");
        $paymentStmt->execute([
            $orderId,
            $normalizedPaymentMethod,
            $initialPaymentStatus,
            $totalAmount,
        ]);
    } catch (Throwable $e) {
        error_log('Unable to create payment record for order ' . $orderId . ': ' . $e->getMessage());
    }

    // Create order items
    $stmt = $db->prepare("
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($checkoutItems as $item) {
        $price = $item['discount_price'] ?? $item['price'];
        $stmt->execute([
            $orderId,
            $item['product_id'],
            $item['name'],
            $item['quantity'],
            $price,
            $price * $item['quantity']
        ]);
    }

    // Clear cart only for cart-based checkout.
    if (!$usesDirectCheckoutItem) {
        $stmt = $db->prepare("DELETE FROM cart_items WHERE user_id = ?");
        $stmt->execute([$userId]);
    }

    if ($voucher) {
        $usageStmt = $db->prepare(
            "UPDATE vouchers
             SET usage_count = usage_count + 1
             WHERE id = ?
               AND (usage_limit IS NULL OR usage_count < usage_limit)"
        );
        $usageStmt->execute([(int) $voucher['id']]);

        if ($usageStmt->rowCount() !== 1) {
            throw new RuntimeException('Voucher usage limit has been reached.');
        }
    }

    $db->commit();
} catch (Throwable $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }

    error('Unable to place order: ' . $e->getMessage(), 422);
}

createCustomerNotification(
    $db,
    (int) $userId,
    'Order placed',
    "Your order {$orderNumber} has been placed successfully.",
    'order_created',
    [
        'order_id' => (int) $orderId,
        'order_number' => $orderNumber,
    ]
);

try {
    $adminStmt = $db->query("SELECT id FROM admins WHERE is_active = 1");
    $adminRows = $adminStmt->fetchAll();
    foreach ($adminRows as $adminRow) {
        $targetAdminId = (int) ($adminRow['id'] ?? 0);
        if ($targetAdminId <= 0) {
            continue;
        }

        createAdminNotification(
            $db,
            $targetAdminId,
            'New customer order',
            "Order {$orderNumber} was placed and is awaiting processing.",
            'order_created',
            [
                'order_id' => (int) $orderId,
                'order_number' => $orderNumber,
                'user_id' => (int) $userId,
            ]
        );
    }
} catch (Throwable) {
    // Notification fan-out should not block successful checkout.
}

success([
    'order_id' => (int) $orderId,
    'order_number' => $orderNumber,
    'total_amount' => $totalAmount,
    'order_status' => $initialStatus,
    'payment_method' => $normalizedPaymentMethod,
    'payment_status' => $initialPaymentStatus,
    'voucher_code' => $voucher ? $voucher['code'] : null,
    'voucher_discount_amount' => $voucher ? $voucherDiscountAmount : 0,
], 'Order placed successfully');