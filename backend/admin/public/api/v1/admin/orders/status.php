<?php
// PATCH /api/v1/admin/orders/:id/status
$me   = requireAuth();
$db   = getDB();
$body = getBody();
$id   = (int) $_route['id'];
requireFields($body, ['status']);

$allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
$status  = strtolower($body['status']);
if (!in_array($status, $allowed)) {
    error('Invalid status. Allowed: ' . implode(', ', $allowed), 422);
}

$chk = $db->prepare("SELECT id, order_number, status FROM orders WHERE id = ?");
$chk->execute([$id]);
$order = $chk->fetch();
if (!$order) error('Order not found', 404);

$old = $order['status'];
$db->prepare("UPDATE orders SET status = ? WHERE id = ?")->execute([$status, $id]);

logAudit($db, $me['admin_id'], 'Update', 'Order', $order['order_number'],
    "Status changed from $old → $status");

success(['status' => $status], 'Order status updated');
