<?php

$db = getDB();

$stmt = $db->prepare(
    "
    SELECT
        id,
        name,
        slug,
        region,
        province,
        display_order
    FROM locations
    WHERE is_active = 1
    ORDER BY display_order ASC, name ASC
    "
);

$stmt->execute();
$locations = $stmt->fetchAll();

success($locations, 'Locations retrieved successfully');
