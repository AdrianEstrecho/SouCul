<?php
// PATCH /api/v1/admin/products/:id
$me   = requireAuth();
$db   = getDB();
$body = getBody();
$id   = (int) $_route['id'];

$chk = $db->prepare("SELECT id, name FROM products WHERE id = ? AND is_active = 1");
$chk->execute([$id]);
if (!$chk->fetch()) error('Product not found', 404);

$fields = [];
$params = [];

$map = [
    'name'        => 'name',
    'description' => 'description',
    'sku'         => 'sku',
    'price'       => 'price',
    'stock'       => 'quantity_in_stock',
    'image'       => 'featured_image_url',
];

foreach ($map as $key => $col) {
    if (array_key_exists($key, $body)) {
        $fields[] = "$col = ?";
        $params[] = $body[$key];
    }
}

if (array_key_exists('status', $body)) {
    $fields[] = 'is_active = ?';
    $params[] = $body['status'] === 'Active' ? 1 : 0;
}

if (array_key_exists('discount', $body) && array_key_exists('price', $body)) {
    $fields[] = 'discount_price = ?';
    $params[] = $body['discount'] > 0
        ? round($body['price'] * (1 - $body['discount'] / 100), 2)
        : null;
}

if (array_key_exists('category', $body)) {
    $locStmt = $db->prepare("SELECT id FROM locations WHERE name = ?");
    $locStmt->execute([$body['category']]);
    $loc = $locStmt->fetch();
    if (!$loc) error("Location not found", 422);
    $fields[] = 'location_id = ?';
    $params[] = $loc['id'];
}

if (array_key_exists('subcategory', $body)) {
    $catStmt = $db->prepare("SELECT id FROM categories WHERE name = ?");
    $catStmt->execute([$body['subcategory']]);
    $cat = $catStmt->fetch();
    if (!$cat) error("Category not found", 422);
    $fields[] = 'category_id = ?';
    $params[] = $cat['id'];
}

if (!$fields) error('No fields to update', 422);

$params[] = $id;
$db->prepare("UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

logAudit($db, $me['admin_id'], 'Update', 'Product', (string) $id, 'Product updated');
success(null, 'Product updated');
