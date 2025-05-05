<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Course Review Page</title>
    <style> 
    table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #aca4a4;
        }
        .course-id {
            width: 75%;
        }
        .review {
            width: 25%;
        }
        .questions-container {
            margin-top: 20px;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #aca4a4;
            display: none;
        }
        .questions-container h3 {
            margin: 0 0 10px;
        }
        .question {
            margin-bottom: 5px;
        }
        .rating-table {
            width: 100%;
            margin-top: 20px;
        }
        .rating-table td {
            padding: 10px;
            text-align: center;
        }
        .text-answer {
            width: 100%;
            padding: 5px;
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .submit-button {
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #e797c3;
            color: black;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .h5page {
            margin-left: auto;
            margin-right: auto;
            margin-top: 3px;
            margin-bottom: 3px;
        }
        .submit-button:hover {
            background-color: #d78eaf;
        }


        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .slider{
            height:100%;
            width:180px;
            position: absolute;
            background-color: #d78eaf;
            transition: 0.5s ease;
            left: -180px;
            transition: left 0.5s ease;
        }

        ul li a{
            list-style: none;
            color: black;
            font-weight: 500;
            padding: 5px 5px;
            display: block;
            text-transform: capitalize;
            text-decoration: none;
            transition: 0.2s ease-out;
            text-align: left;
        }
         </style>
</head>
<body style="background-color: #f0bcd8;">

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

$sql = "SELECT courseID FROM course_reviews";
$result = $conn->query($sql);

$courses = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row["courseID"];
    }
}

if (!isset($_SESSION['studentID'])) {
    header("Location: ../login.html");
    exit();
}

if (isset($_SESSION['studentCourses'])) {
    $sessionCourseIDs = $_SESSION['studentCourses'];
} else {
    $sessionCourseIDs = array();
}

$courseIDs = array_unique(array_merge($courses, $sessionCourseIDs));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $studentID = $_SESSION['studentID'];
    $courseID = $_POST['courseID'];

    $q1 = $_POST['effort'];
    $q2 = $_POST['knowledge_start'];
    $q3 = $_POST['knowledge_end'];

    $q4 = $_POST['q4'];
    $q5 = $_POST['q5'];
    $q6 = $_POST['q6'];

    $sql = "INSERT INTO course_reviews (studentID, courseID, q1, q2, q3, q4, q5, q6)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            q1 = VALUES(q1),
            q2 = VALUES(q2),
            q3 = VALUES(q3),
            q4 = VALUES(q4),
            q5 = VALUES(q5),
            q6 = VALUES(q6)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("ssssssss", $studentID, $courseID, $q1, $q2, $q3, $q4, $q5, $q6);

    if ($stmt->execute()) {
        echo "<script>alert('Review submitted successfully!');</script>";
    } else {
        echo "<script>alert('Error submitting review: " . $stmt->error . "');</script>";
    }

    $stmt->close();
}

?>

<div class="header">
    <div class="menu" onclick="toggleSlider()">☰</div>
    <h4 class="h5page">Course Review</h4>
    <div class="search"><input type="text" placeholder="Search.." oninput="filterCourses()"></div>
</div>

<label>
    <div class="slider" id="slider">
        <ul>
            <li><a href="#">Events Calendar</a></li>
            <li><a href="#">Study Group Finder</a></li>
            <li><a href="#">Course Reviews</a></li>
            <li><a href="#">Course Notes</a></li>
            <li><a href="#">Campus News</a></li>
            <li><a href="#">Club Activities</a></li>
            <li><a href="#">Student Marketplace</a></li>
            <li><a href="logout.php">Logout</a></li>
        </ul>
    </div>
</label>

<div class="container">

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th class="course-id">Course ID</th>
                    <th class="review">Review</th>
                </tr>
            </thead>
            <tbody id="coursesBody">
                <?php
                if (empty($courseIDs)) {
                    echo '<tr><td colspan="2">No courses found.</td></tr>';
                } else {
                    foreach ($courseIDs as $courseID) {
                        echo '<tr>';
                        echo '<td>' . htmlspecialchars($courseID) . '</td>';
                        echo '<td><button onclick="showQuestions()">&gt;</button></td>';
                        echo '</tr>';
                    }
                }
                ?>
            </tbody>
        </table>
    </div>

    <div class="questions-container" id="questionsContainer">
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <input type="hidden" id="selectedCourseID" name="courseID" value="">
            <table class="rating-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Very Good</th>
                        <th>Good</th>
                        <th>Fair</th>
                        <th>Poor</th>
                        <th>Very Poor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1. How effective were the learning materials (e.g., textbooks, online resources) used in the course?</td>
                        <td><input type="radio" name="effort" value="very_good" required></td>
                        <td><input type="radio" name="effort" value="good" required></td>
                        <td><input type="radio" name="effort" value="fair" required></td>
                        <td><input type="radio" name="effort" value="poor" required></td>
                        <td><input type="radio" name="effort" value="very_poor" required></td>
                    </tr>
                    <tr>
                        <td>2. Were the assignments and projects relevant to the course content?</td>
                        <td><input type="radio" name="knowledge_start" value="very_good" required></td>
                        <td><input type="radio" name="knowledge_start" value="good" required></td>
                        <td><input type="radio" name="knowledge_start" value="fair" required></td>
                        <td><input type="radio" name="knowledge_start" value="poor" required></td>
                        <td><input type="radio" name="knowledge_start" value="very_poor" required></td>
                    </tr>
                    <tr>
                        <td>3. How satisfied were you with the overall learning experience in this course?</td>
                        <td><input type="radio" name="knowledge_end" value="very_good" required></td>
                        <td><input type="radio" name="knowledge_end" value="good" required></td>
                        <td><input type="radio" name="knowledge_end" value="fair" required></td>
                        <td><input type="radio" name="knowledge_end" value="poor" required></td>
                        <td><input type="radio" name="knowledge_end" value="very_poor" required></td>
                    </tr>
                </tbody>
            </table>

            <div class="question">
                4. What improvements would you suggest?
                <input type="text" class="text-answer" name="q4" placeholder="Your answer here...">
            </div>
            <div class="question">
                5. What aspects of the teaching methods did you find most beneficial?
                <input type="text" class="text-answer" name="q5" placeholder="Your answer here...">
            </div>
            <div class="question">
                6. What resources or materials would you suggest adding to improve the course?
                <input type="text" class="text-answer" name="q6" placeholder="Your answer here...">
            </div>

            <button class="submit-button" type="submit">Submit</button>
        </form>
    </div>
</div>
<script>
    let selectedCourseID = null; 

    function showQuestions() {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.style.display = 'block';

        const table = document.querySelector('.table-container table');
        table.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'BUTTON') {
                const row = target.closest('tr');
                selectedCourseID = row.cells[0].textContent;
                document.getElementById('selectedCourseID').value = selectedCourseID; 
            }
        });
    }

    function toggleSlider() {
        const slider = document.getElementById('slider');
        if (slider.style.left === '0px') {
            slider.style.left = '-180px';
        } else {
            slider.style.left = '0px';
        }
    }

    function filterCourses() {
        const searchInput = document.querySelector('.search input').value.toLowerCase();
        const coursesBody = document.getElementById('coursesBody');
        const rows = coursesBody.getElementsByTagName('tr');

        for (let row of rows) {
            const courseId = row.cells[0].textContent.toLowerCase();
            row.style.display = courseId.includes(searchInput) ? '' : 'none';
        }
    }
</script>
</body>
</html>
<?php
$conn->close();
?>