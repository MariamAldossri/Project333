<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Hello, world!";



$host = "localhost";
$username = "db";
$password = "UOB123321-M";
$database = "project";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$studentID = $_POST['studentID'];
$password = $_POST['password'];

$studentID = htmlspecialchars(strip_tags(trim($studentID)));
$password = htmlspecialchars(strip_tags(trim($password)));

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$studentID = $_POST['studentID'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT studentID, password FROM students WHERE studentID = ?");
$stmt->bind_param("s", $studentID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];

    if (password_verify($password, $hashed_password)) {
        header("Location: /project333/CourseReview/CourseReview.php");
        exit();
    } else {
        header("Location: login.html?error=Incorrect%20password");
        exit();
    }
} else {
    header("Location: login.html?error=StudentID%20not%20found");
    exit();
}




$stmt->close();
$conn->close();
?>