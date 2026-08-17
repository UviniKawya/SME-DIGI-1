<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$stmt = $pdo->query("SELECT * FROM smes ORDER BY created_at DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
