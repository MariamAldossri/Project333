<?php
session_start(); 

$host = "localhost";
$username = "db";
$password = "UOB123321-M";
$database = "project";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (!isset($_SESSION['studentID'])) {
    echo json_encode(array("error" => "studentID not set in session"));
    exit();
}

$studentID = $_SESSION['studentID'];

$sql = "SELECT courseID FROM student_courses WHERE studentID = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $studentID);  

$stmt->execute();

$result = $stmt->get_result();

$courses = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row["courseID"];
    }
}

$_SESSION['studentCourses'] = $courses;

header('Content-Type: application/json');
echo json_encode($courses);

$stmt->close();
$conn->close();
?>