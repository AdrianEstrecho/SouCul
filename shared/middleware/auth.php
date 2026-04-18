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

require_once __DIR__ . '/../helpers/functions.php';

function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!str_starts_with($header, 'Bearer ')) {
        error('Unauthorized — missing token', 401);
    }
    $token   = substr($header, 7);
    $payload = jwtDecode($token);
    if (!$payload) {
        error('Unauthorized — invalid or expired token', 401);
    }

    if (isset($payload['user_id'])) {
        $refreshedPayload = $payload;
        unset($refreshedPayload['exp'], $refreshedPayload['iat']);
        $refreshedToken = jwtEncodeWithExpiry($refreshedPayload, CUSTOMER_INACTIVITY_TIMEOUT_SECONDS);
        header('X-Auth-Token: ' . $refreshedToken);
    }

    return $payload; // ['admin_id', 'email', 'role', 'exp', 'iat']
}

function normalizeAdminRole(string $role): string {
    $normalized = strtolower(trim($role));
    $normalized = preg_replace('/[\s-]+/', '_', $normalized) ?? '';
    $compact = str_replace('_', '', $normalized);

    if ($normalized === 'super_admin' || $compact === 'superadmin') {
        return 'super_admin';
    }
    if ($normalized === 'shop_owner' || $normalized === 'admin' || $compact === 'shopowner') {
        return 'shop_owner';
    }
    if ($normalized === 'inventory_manager' || $normalized === 'staff' || $compact === 'inventorymanager') {
        return 'inventory_manager';
    }

    return $normalized;
}

function adminRoleRank(string $role): int {
    $normalized = normalizeAdminRole($role);
    return match ($normalized) {
        'inventory_manager' => 10,
        'shop_owner' => 20,
        'super_admin' => 30,
        default => 0,
    };
}

function requireRoleAtLeast(string $minimumRole): array {
    $payload = requireAuth();
    $currentRole = normalizeAdminRole((string)($payload['role'] ?? ''));
    $requiredRole = normalizeAdminRole($minimumRole);

    if (adminRoleRank($requiredRole) <= 0) {
        error('Server role configuration error', 500);
    }

    if (adminRoleRank($currentRole) < adminRoleRank($requiredRole)) {
        $requiredLabel = match ($requiredRole) {
            'super_admin' => 'super admin',
            'shop_owner' => 'admin',
            'inventory_manager' => 'staff',
            default => 'authorized',
        };
        error("Forbidden — {$requiredLabel} access required", 403);
    }

    $payload['role'] = $currentRole;
    return $payload;
}

function requireAdminOrHigher(): array {
    return requireRoleAtLeast('shop_owner');
}

function requireSuperAdmin(): array {
    return requireRoleAtLeast('super_admin');
}
