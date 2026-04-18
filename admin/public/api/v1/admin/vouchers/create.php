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

// POST /api/v1/admin/vouchers
$me   = requireAdminOrHigher();
$db   = getDB();
$body = getBody();
requireFields($body, ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_until']);

$code = strtoupper(trim($body['code']));
if ($code === '') {
    error('Voucher code is required.', 422);
}

$chk = $db->prepare("SELECT id FROM vouchers WHERE code = ?");
$chk->execute([$code]);
if ($chk->fetch()) error("Voucher code '$code' already exists", 409);

$allowedTypes = ['percentage', 'fixed'];
$type = strtolower(trim((string) ($body['discount_type'] ?? '')));
if (!in_array($type, $allowedTypes, true)) {
    error('Voucher discount type must be percentage or fixed.', 422);
}

$discountValue = (float) ($body['discount_value'] ?? 0);
if ($discountValue <= 0) {
    error('Voucher discount value must be greater than zero.', 422);
}
if ($type === 'percentage' && $discountValue > 100) {
    error('Percentage discount cannot exceed 100%.', 422);
}

$minPurchaseAmount = max(0, (float) ($body['min_purchase_amount'] ?? 0));

$maxDiscountAmount = null;
if (array_key_exists('max_discount_amount', $body) && $body['max_discount_amount'] !== '' && $body['max_discount_amount'] !== null) {
    $maxDiscountAmount = (float) $body['max_discount_amount'];
    if ($maxDiscountAmount <= 0) {
        error('Max discount amount must be greater than zero.', 422);
    }
}

$usageLimit = null;
if (array_key_exists('usage_limit', $body) && $body['usage_limit'] !== '' && $body['usage_limit'] !== null) {
    $usageLimit = (int) $body['usage_limit'];
    if ($usageLimit <= 0) {
        error('Usage limit must be greater than zero.', 422);
    }
}

$perUserLimit = null;
if (array_key_exists('per_user_limit', $body) && $body['per_user_limit'] !== '' && $body['per_user_limit'] !== null) {
    $perUserLimit = (int) $body['per_user_limit'];
    if ($perUserLimit <= 0) {
        error('Per-user limit must be greater than zero.', 422);
    }
}

$validFrom = trim((string) ($body['valid_from'] ?? ''));
$validUntil = trim((string) ($body['valid_until'] ?? ''));
if (!$validFrom || !$validUntil) {
    error('Voucher validity dates are required.', 422);
}

$validFromDate = date_create($validFrom);
$validUntilDate = date_create($validUntil);
if (!$validFromDate || !$validUntilDate) {
    error('Voucher validity dates are invalid.', 422);
}

if ($validUntilDate < $validFromDate) {
    error('Voucher valid-until date must be on or after valid-from date.', 422);
}

$status = strtolower(trim((string) ($body['status'] ?? 'active')));
if (!in_array($status, ['active', 'inactive'], true)) {
    error('Voucher status must be active or inactive.', 422);
}

$description = array_key_exists('description', $body)
    ? trim((string) $body['description'])
    : null;
$description = $description === '' ? null : $description;

$stmt = $db->prepare(
    "INSERT INTO vouchers
        (code, discount_type, discount_value, min_purchase_amount,
         max_discount_amount, usage_limit, per_user_limit,
         valid_from, valid_until, status, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([
    $code,
    $type,
    $discountValue,
    $minPurchaseAmount,
    $maxDiscountAmount,
    $usageLimit,
    $perUserLimit,
    $validFromDate->format('Y-m-d'),
    $validUntilDate->format('Y-m-d'),
    $status,
    $description,
]);

logAudit($db, $me['admin_id'], 'Create', 'Voucher', $code, 'Voucher created');
success(['id' => $db->lastInsertId()], 'Voucher created', 201);
