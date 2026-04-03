<?php
// DELETE /api/v1/admin/products/:id  (soft archive)
$me = requireAuth();
$db = getDB();
$id = (int) $_route['id'];

$chk = $db->prepare("SELECT name FROM products WHERE id = ? AND is_active = 1");
$chk->execute([$id]);
$product = $chk->fetch();
if (!$product) error('Product not found', 404);

$db->prepare("UPDATE products SET is_active = 0 WHERE id = ?")->execute([$id]);
logAudit($db, $me['admin_id'], 'Archive', 'Product', $product['name'], 'Product archived');
success(null, 'Product archived');
