<?php
require 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"), true);
  $stmt = $pdo->prepare("DELETE FROM groups WHERE id = ?");
  $stmt->execute([$data['id']]);
  echo json_encode(["status" => "deleted"]);
}
?>