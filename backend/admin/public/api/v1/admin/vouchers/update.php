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

// PATCH /api/v1/admin/vouchers/:id
$me   = requireAdminOrHigher();
$db   = getDB();
$body = getBody();
$id   = (int) $_route['id'];

$chk = $db->prepare(
    "SELECT id, code, discount_type, discount_value, min_purchase_amount,
            max_discount_amount, usage_limit, per_user_limit,
            valid_from, valid_until, status, description
     FROM vouchers
     WHERE id = ?"
);
$chk->execute([$id]);
$voucher = $chk->fetch();
if (!$voucher) error('Voucher not found', 404);

$fields = [];
$params = [];

$map = [
    'discount_type'        => 'discount_type',
    'discount_value'       => 'discount_value',
    'min_purchase_amount'  => 'min_purchase_amount',
    'max_discount_amount'  => 'max_discount_amount',
    'usage_limit'          => 'usage_limit',
    'per_user_limit'       => 'per_user_limit',
    'valid_from'           => 'valid_from',
    'valid_until'          => 'valid_until',
    'status'               => 'status',
    'description'          => 'description',
];

foreach ($map as $key => $col) {
    if (array_key_exists($key, $body)) {
        $value = $body[$key];

        if ($key === 'discount_type') {
            $value = strtolower(trim((string) $value));
            if (!in_array($value, ['percentage', 'fixed'], true)) {
                error('Voucher discount type must be percentage or fixed.', 422);
            }
        }

        if ($key === 'discount_value') {
            $value = (float) $value;
            if ($value <= 0) {
                error('Voucher discount value must be greater than zero.', 422);
            }

            $candidateType = strtolower((string) ($body['discount_type'] ?? $voucher['discount_type']));
            if ($candidateType === 'percentage' && $value > 100) {
                error('Percentage discount cannot exceed 100%.', 422);
            }
        }

        if ($key === 'min_purchase_amount') {
            $value = max(0, (float) $value);
        }

        if ($key === 'max_discount_amount') {
            if ($value === '' || $value === null) {
                $value = null;
            } else {
                $value = (float) $value;
                if ($value <= 0) {
                    error('Max discount amount must be greater than zero.', 422);
                }
            }
        }

        if ($key === 'usage_limit' || $key === 'per_user_limit') {
            if ($value === '' || $value === null) {
                $value = null;
            } else {
                $value = (int) $value;
                if ($value <= 0) {
                    error(ucfirst(str_replace('_', '-', $key)) . ' must be greater than zero.', 422);
                }
            }
        }

        if ($key === 'valid_from' || $key === 'valid_until') {
            $value = trim((string) $value);
            $dt = date_create($value);
            if (!$dt) {
                error('Voucher validity dates are invalid.', 422);
            }
            $value = $dt->format('Y-m-d');
        }

        if ($key === 'status') {
            $value = strtolower(trim((string) $value));
            if (!in_array($value, ['active', 'inactive'], true)) {
                error('Voucher status must be active or inactive.', 422);
            }
        }

        if ($key === 'description') {
            $value = trim((string) $value);
            $value = $value === '' ? null : $value;
        }

        $fields[] = "$col = ?";
        $params[] = $value;
    }
}

if (!$fields) error('No fields to update', 422);

$nextValidFrom = (string) ($body['valid_from'] ?? $voucher['valid_from']);
$nextValidUntil = (string) ($body['valid_until'] ?? $voucher['valid_until']);
$nextValidFromDate = date_create($nextValidFrom);
$nextValidUntilDate = date_create($nextValidUntil);
if (!$nextValidFromDate || !$nextValidUntilDate || $nextValidUntilDate < $nextValidFromDate) {
    error('Voucher valid-until date must be on or after valid-from date.', 422);
}

$params[] = $id;
$db->prepare("UPDATE vouchers SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

logAudit($db, $me['admin_id'], 'Update', 'Voucher', $voucher['code'], 'Voucher updated');
success(null, 'Voucher updated');
