<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['sme_name']) || empty($data['business_type']) || empty($data['location'])
    || !isset($data['employees']) || !isset($data['years_operation'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO smes (sme_name, business_type, location, employees, years_operation)
                        VALUES (?, ?, ?, ?, ?)");
$stmt->execute([
    $data['sme_name'],
    $data['business_type'],
    $data['location'],
    $data['employees'],
    $data['years_operation']
]);

echo json_encode([
    "success" => true,
    "id" => $pdo->lastInsertId()
]);
