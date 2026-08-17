<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$sme_id = $_GET['sme_id'] ?? null;
if (!$sme_id) { http_response_code(400); echo json_encode(["error" => "sme_id required"]); exit; }

// 1. Average Likert score per dimension (Digital Readiness)
$stmt = $pdo->prepare("
    SELECT q.dimension, ROUND(AVG(r.score), 2) AS avg_score
    FROM assessment_responses r
    JOIN assessment_questions q ON r.question_id = q.id
    WHERE r.sme_id = ?
    GROUP BY q.dimension
");
$stmt->execute([$sme_id]);
$readiness = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 2. Inventory summary
$stmt = $pdo->prepare("SELECT item_name, quantity, reorder_level FROM inventory WHERE sme_id = ?");
$stmt->execute([$sme_id]);
$inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

$lowStockCount = 0;
foreach ($inventory as $item) {
    if ($item['quantity'] <= $item['reorder_level']) $lowStockCount++;
}

// 3. Sales summary (last 6 months by month)
$stmt = $pdo->prepare("
    SELECT DATE_FORMAT(sale_date, '%Y-%m') AS month, SUM(quantity_sold * sale_price) AS total_revenue
    FROM sales
    WHERE sme_id = ?
    GROUP BY month
    ORDER BY month ASC
");
$stmt->execute([$sme_id]);
$salesTrend = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 4. Overall digital readiness score (avg of all dimension averages)
$overall = 0;
if (count($readiness) > 0) {
    $sum = array_sum(array_column($readiness, 'avg_score'));
    $overall = round($sum / count($readiness), 2);
}

echo json_encode([
    "readiness_by_dimension" => $readiness,
    "overall_score" => $overall,
    "inventory" => $inventory,
    "low_stock_count" => $lowStockCount,
    "sales_trend" => $salesTrend
]);
