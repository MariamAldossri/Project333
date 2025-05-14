<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getInputData() {
    return json_decode(file_get_contents('php://input'), true);
}

// Parse ID from query if provided
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Get reviews for a specific product
            $stmt = $pdo->prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC");
            $stmt->execute([$id]);
            $reviews = $stmt->fetchAll();
            echo json_encode($reviews);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID required']);
        }
        break;

    case 'POST':
        $data = getInputData();
        if (empty($data['product_id']) || empty($data['content'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        try {
            $stmt = $pdo->prepare("INSERT INTO reviews (product_id, content) VALUES (?, ?)");
            $stmt->execute([
                $data['product_id'],
                $data['content']
            ]);
            $id = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Review added successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add review: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
