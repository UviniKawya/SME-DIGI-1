<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['sme_id']) || empty($data['answers']) || !is_array($data['answers'])) {
    http_response_code(400);
    echo json_encode(["error" => "sme_id and answers[] are required"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO assessment_responses (sme_id, question_id, score) VALUES (?, ?, ?)");

$pdo->beginTransaction();
foreach ($data['answers'] as $answer) {
    // answer = { question_id, score }
    $stmt->execute([$data['sme_id'], $answer['question_id'], $answer['score']]);
}
$pdo->commit();

echo json_encode(["success" => true]);
