<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost";
$username = "db";
$password = "UOB123321-M"; 
$database = "project";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$studentID = $_POST['studentID'];
$name = $_POST['name'];
$email = $_POST['email'];
$plain_password = $_POST['password'];

$studentID = htmlspecialchars(strip_tags(trim($studentID)));
$name = htmlspecialchars(strip_tags(trim($name)));
$email = htmlspecialchars(strip_tags(trim($email)));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: register.html?error=Invalid%20email%20format");
    exit();
}

if (!preg_match("/^[a-zA-Z0-9]{8}$/", $studentID)) {
    header("Location: register.html?error=Invalid%20StudentID%20format.%20Must%20be%208%20alphanumeric%20characters.");
    exit();
}


$stmt = $conn->prepare("SELECT studentID FROM students WHERE studentID = ?");
$stmt->bind_param("s", $studentID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    header("Location: register.html?error=StudentID%20already%20exists");
    exit();
}

$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO students (studentID, name, email, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $studentID, $name, $email, $hashed_password);

if ($stmt->execute()) {
    header("Location: login.html?success=Registration%20successful");
    exit();
} else {
    header("Location: register.html?error=Registration%20failed:%20" . urlencode($stmt->error));
    exit();
}

$stmt->close();
$conn->close();

?>