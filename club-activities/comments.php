<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: ");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse ID from query if provided
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Get comments for a specific activity
            $stmt = $pdo->prepare("SELECT FROM comments WHERE activity_id = ? ORDER BY created_at DESC");
            $stmt->execute([$id]);
            $comments = $stmt->fetchAll();
            echo json_encode($comments);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Activity ID required']);
        }
        break;

    case 'POST':
        $data = getInputData();

        if (empty($data['activity_id']) || empty($data['content'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO comments (activity_id, content) VALUES (?, ?)");
            $stmt->execute([
                $data['activity_id'],
                $data['content']
            ]);

            $id = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Comment added successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add comment: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>