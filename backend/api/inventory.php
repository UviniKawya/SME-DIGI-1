<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $sme_id = $_GET['sme_id'] ?? null;
        if (!$sme_id) { http_response_code(400); echo json_encode(["error" => "sme_id required"]); exit; }
        $stmt = $pdo->prepare("SELECT * FROM inventory WHERE sme_id = ? ORDER BY created_at DESC");
        $stmt->execute([$sme_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO inventory (sme_id, item_name, category, quantity, unit_price, reorder_level)
                                VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['sme_id'], $data['item_name'], $data['category'] ?? null,
            $data['quantity'] ?? 0, $data['unit_price'] ?? 0, $data['reorder_level'] ?? 5
        ]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("UPDATE inventory SET item_name=?, category=?, quantity=?, unit_price=?, reorder_level=? WHERE id=?");
        $stmt->execute([
            $data['item_name'], $data['category'] ?? null, $data['quantity'],
            $data['unit_price'], $data['reorder_level'], $data['id']
        ]);
        echo json_encode(["success" => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $pdo->prepare("DELETE FROM inventory WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
