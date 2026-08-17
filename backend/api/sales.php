<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $sme_id = $_GET['sme_id'] ?? null;
        if (!$sme_id) { http_response_code(400); echo json_encode(["error" => "sme_id required"]); exit; }
        $stmt = $pdo->prepare("
            SELECT s.*, i.item_name
            FROM sales s JOIN inventory i ON s.item_id = i.id
            WHERE s.sme_id = ? ORDER BY s.sale_date DESC");
        $stmt->execute([$sme_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO sales (sme_id, item_id, quantity_sold, sale_price, sale_date)
                                VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['sme_id'], $data['item_id'], $data['quantity_sold'],
            $data['sale_price'], $data['sale_date']
        ]);

        // Reduce inventory stock
        $update = $pdo->prepare("UPDATE inventory SET quantity = quantity - ? WHERE id = ?");
        $update->execute([$data['quantity_sold'], $data['item_id']]);

        $pdo->commit();
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $stmt = $pdo->prepare("DELETE FROM sales WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
}
