<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

try {
    $conn = new PDO("mysql:host=127.0.0.1;dbname=" . getenv("db_name"), getenv("db_user"), getenv("db_pass"));
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    // Get total count
    $total = $conn->query("SELECT COUNT(*) FROM events")->fetchColumn();

    // Get paginated results
    $stmt = $conn->prepare("SELECT * FROM events ORDER BY date DESC LIMIT ? OFFSET ?");
    $stmt->execute([$limit, $offset]);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $events,
        "pagination" => [
            "page" => $page,
            "limit" => $limit,
            "total" => $total,
            "total_pages" => ceil($total / $limit)
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}