<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header('Content-Type: application/json');
require 'db.php';

try {
    $conn = new PDO("mysql:host=127.0.0.1;dbname=" . getenv("db_name"), getenv("db_user"), getenv("db_pass"));
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? 0;
    $title = $data['title'] ?? '';
    $date = $data['date'] ?? '';
    $location = $data['location'] ?? '';
    $description = $data['description'] ?? '';
    $popularity = $data['popularity'] ?? 0;

    if (!$id || !$title || !$date || !$location) {
        http_response_code(400);
        echo json_encode(["error" => "Incomplete data"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE events SET title=?, date=?, location=?, description=?, popularity=? WHERE id=?");
    $stmt->execute([$title, $date, $location, $description, $popularity, $id]);

    echo json_encode(["message" => "Event updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
