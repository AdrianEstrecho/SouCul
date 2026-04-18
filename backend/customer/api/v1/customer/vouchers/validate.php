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

// GET /api/v1/customer/vouchers/validate?code=...&subtotal=...

$auth = requireAuth();
$userId = (int) ($auth['user_id'] ?? 0);

if ($userId <= 0) {
    error('User authentication failed', 401);
}

$code = strtoupper(trim((string) getParam('code')));
$subtotal = (float) (getParam('subtotal') ?? 0);

if ($code === '') {
    error('Voucher code is required.', 422);
}

if ($subtotal <= 0) {
    error('Subtotal must be greater than zero.', 422);
}

$db = getDB();
$voucherStmt = $db->prepare(
    "SELECT id, code, discount_type, discount_value, min_purchase_amount,
            max_discount_amount, usage_limit, usage_count, per_user_limit,
            valid_from, valid_until, status
     FROM vouchers
     WHERE code = ?
     LIMIT 1"
);
$voucherStmt->execute([$code]);
$voucher = $voucherStmt->fetch();

if (!$voucher) {
    error('Voucher code is invalid.', 422);
}

$status = strtolower(trim((string) ($voucher['status'] ?? 'inactive')));
if ($status !== 'active') {
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
    $discountAmount = min($subtotal, $discountValue);
} else {
    $discountAmount = $subtotal * ($discountValue / 100);
    $maxDiscountAmount = isset($voucher['max_discount_amount'])
        ? (float) $voucher['max_discount_amount']
        : null;

    if ($maxDiscountAmount !== null && $maxDiscountAmount > 0) {
        $discountAmount = min($discountAmount, $maxDiscountAmount);
    }
}

$discountAmount = max(0, min($subtotal, round($discountAmount, 2)));
if ($discountAmount <= 0) {
    error('Voucher does not provide a discount for this order.', 422);
}

success([
    'code' => $voucher['code'],
    'discount_type' => $discountType,
    'discount_value' => $discountValue,
    'discount_amount' => $discountAmount,
    'subtotal' => round($subtotal, 2),
    'total_after_discount' => max(0, round($subtotal - $discountAmount, 2)),
], 'Voucher is valid.');
