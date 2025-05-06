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

if (isset($_SESSION['studentID'])) {
    $studentID = $_SESSION['studentID'];

    $sql = "SELECT courseID FROM course_reviews WHERE studentID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $studentID);
    $stmt->execute();
    $result = $stmt->get_result();

    $courses = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row["courseID"];
        }

        $_SESSION['studentCourses'] = $courses;

        header("Location: courseReview.php");
        exit();
    } else {
        $_SESSION['studentCourses'] = array();
        header("Location: CourseReview.php?message=No courses found.");
        exit();
    }

    $stmt->close();
} else {
    header("Location: ../login.html");
    exit();
}

$conn->close();

?>