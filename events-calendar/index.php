<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <title>Campus Hub - All Events</title>
  <link href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <h1>📅 Campus Hub - Event List</h1>

</head>
  
<body>

    <?php

        $host = "127.0.0.1";
        $user = getenv("db_user");
        $pass = getenv("db_pass");
        $db = getenv("db_name");

        $conn = new mysqli($host, $user, $pass, $db);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        echo "<p>DATABASE connected successfully!</p>";

        $sql = "SELECT id, title, date, location, popularity FROM events ORDER BY date DESC";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo "<h2>Upcoming Events</h2>";
            echo "<ul>";
            while($row = $result->fetch_assoc()) {
                echo "<li>";
            
                echo "<strong>" . htmlspecialchars($row['title']) . "</strong>";
                echo "<br>Date: " . htmlspecialchars($row['date']);
                echo "<br>Location: " . htmlspecialchars($row['location']);
                echo "<br>Popularity: " . htmlspecialchars($row['popularity']);
                echo "</li>";
            }
            echo "</ul>";
        } else {
            echo "<p>No events found.</p>";
        }

        $conn->close();
    ?>
</body>
</html>
