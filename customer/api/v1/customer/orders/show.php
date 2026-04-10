<?php
// GET /api/v1/customer/orders/:id

$auth = requireAuth();
$userId = $auth['user_id'] ?? null;
$orderId = $_route['id'] ?? null;

if (!$userId || !$orderId) {
    error('Invalid request', 400);
}

$db = getDB();

$stmt = $db->prepare("
    SELECT 
        o.*,
        CONCAT(u.first_name,' ',u.last_name) AS customer
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = ? AND o.user_id = ?
");
$stmt->execute([$orderId, $userId]);
$order = $stmt->fetch();

if (!$order) {
    error('Order not found', 404);
}

$items = [];
try {
    $itemsStmt = $db->prepare("\n        SELECT id, product_id, product_name, quantity, unit_price, total_price\n        FROM order_items\n        WHERE order_id = ?\n        ORDER BY id ASC\n    ");
    $itemsStmt->execute([$orderId]);
    $items = $itemsStmt->fetchAll();
} catch (Throwable) {
    $items = [];
}

$payment = null;
try {
    $paymentStmt = $db->prepare("\n        SELECT payment_method, payment_status, transaction_id, amount, processed_at\n        FROM payments\n        WHERE order_id = ?\n        LIMIT 1\n    ");
    $paymentStmt->execute([$orderId]);
    $payment = $paymentStmt->fetch() ?: null;
} catch (Throwable) {
    $payment = null;
}

$order['items'] = $items;
$order['payment'] = $payment;

success($order, 'Order details retrieved');
