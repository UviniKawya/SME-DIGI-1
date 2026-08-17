<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$business_type = $_GET['business_type'] ?? '';

if (!$business_type) {
    http_response_code(400);
    echo json_encode(["error" => "business_type is required"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM assessment_questions WHERE business_type = ? ORDER BY dimension, display_order");
$stmt->execute([$business_type]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Group by dimension so the frontend can render sections easily
$grouped = [];
foreach ($rows as $row) {
    $grouped[$row['dimension']][] = $row;
}

echo json_encode($grouped);
