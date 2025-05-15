<?php
$host = "127.0.0.1";
$db   = "mydb"; // ← MUST match your database name in Adminer
$user = "user1"; // ← MUST match the user you logged in with in Adminer
$pass = "";      // ← If you set a password, use it here
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed: " . $e->getMessage()]);
  exit;
}
?>
