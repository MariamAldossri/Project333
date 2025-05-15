<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST['title'];
    $event_date = $_POST['event_date'];
     $location = $_POST['location'];
    $description = $_POST['description'];
    

    $host = "127.0.0.1";
    $user = getenv("db_user");
    $pass = getenv("db_pass");
    $db = getenv("db_name");

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO events (title, event_date,location,description)
            VALUES ('$title','$event_date', '$location','$description')";

    if ($conn->query($sql) === TRUE) {
        echo "New event added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Add New Event</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h2>Add New Event</h2>
  <form action="submitEvent.php" method="POST">
    <label for="title">Event Title</label>
    <input type="text" id="title" name="title" required><br>
      
<label for="event_date">Event Date</label>
    <input type="date" id="event_date" name="event_date" required><br>
      
       <label for="location">Location</label>
    <input type="text" id="location" name="location" required><br>
      
    <label for="description">Description</label>
    <textarea id="description" name="description" required></textarea><br>

    <button type="submit">Submit Event</button>
  </form>
</body>
</html>