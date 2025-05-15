<?php
require 'db.php'; // Ensure db.php exists and connects using PDO

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);

  if (!isset($data['name'], $data['subject'], $data['day'], $data['time'])) {
    echo json_encode(["error" => "Missing fields"]);
    exit;
  }

  try {
    $stmt = $pdo->prepare("INSERT INTO groups (name, subject, day, time) VALUES (?, ?, ?, ?)");
    $stmt->execute([
      $data['name'],
      $data['subject'],
      $data['day'],
      $data['time']
    ]);

    echo json_encode(["status" => "success"]);
  } catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
  }
} else {
  echo json_encode(["error" => "Invalid request method"]);
}
