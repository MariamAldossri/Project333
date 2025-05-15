<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");
header('Content-Type: application/json');
require 'db.php';

try {
    $conn = new PDO("mysql:host=127.0.0.1;dbname=" . getenv("db_name"), getenv("db_user"), getenv("db_pass"));
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? 0;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Event ID is required"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Event not found"]);
        exit;
    }

    echo json_encode(["message" => "Event deleted successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}