<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'db.php';
header('Content-Type: application/json');
$stmt = $pdo->query("SELECT * FROM groups");
$groups = $stmt->fetchAll();
echo json_encode($groups);
?>