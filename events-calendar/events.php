<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events Calendar</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="bg-gradient-to-r from-purple-700 to-pink-500 text-white">
        <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
            <h1 class="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
                Events calendar
            </h1>

            <nav class="flex flex-wrap justify-center gap-4">
                <a href="home.html" class="btn-header">Home</a>
                <a href="course-notes.html" class="btn-header">Course Notes</a>
                <a href="course-review.html" class="btn-header">Course Review</a>
                <a href="events-calendar.php" class="btn-header">Events Calendar</a>
                <a href="club-activites.html" class="btn-header">Club Activites</a>
                <a href="campus-news.html" class="btn-header">Campus News</a>
                <a href="student-marketplace.html" class="btn-header">Student Marketplace</a>
            </nav>
        </div>
    </header>

    <main class="container mt-4">
        <section class="mb-4">
            <h2>Events Listing</h2>
            <div class="d-flex justify-content-between mb-3">
                <input type="text" class="form-control w-50" placeholder="Search events..." aria-label="Search">
                <div>
                    <button class="btn btn-info">Sort by Date</button>
                    <button class="btn btn-info">Sort by Popularity</button>
                    <button class="btn btn-success" data-toggle="modal" data-target="#newEventModal">Add New Event</button>
                </div>
            </div>

            <div class="row" id="events-container">
                <?php
                    $host = "127.0.0.1";
                    $user = getenv("db_user");
                    $pass = getenv("db_pass");
                    $db = getenv("db_name");

                    $conn = new mysqli($host, $user, $pass, $db);

                    if ($conn->connect_error) {
                        die("Connection failed: " . $conn->connect_error);
                    }

                    $sql = "SELECT id, title, date, location, popularity FROM events ORDER BY date DESC";
                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<div class="col-md-6 mb-4">';
                            echo '<div class="card">';
                            echo '<div class="card-body">';
                            echo '<h5 class="card-title">' . htmlspecialchars($row['title']) . '</h5>';
                            echo '<p class="card-text">Date: ' . htmlspecialchars($row['date']) . '</p>';
                            echo '<p class="card-text">Location: ' . htmlspecialchars($row['location']) . '</p>';
                            echo '<p class="card-text">Popularity: ' . htmlspecialchars($row['popularity']) . '</p>';
                            echo '<div class="d-flex justify-content-end">';
                            echo '<button class="btn btn-sm btn-primary mr-2">Edit</button>';
                            echo '<button class="btn btn-sm btn-danger">Delete</button>';
                            echo '</div>';
                            echo '</div>';
                            echo '</div>';
                            echo '</div>';
                        }
                    } else {
                        echo '<div class="col-12"><p>No events found.</p></div>';
                    }
                    $conn->close();
                ?>
            </div>

            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
            </nav>
        </section>

        <div class="modal fade" id="newEventModal" tabindex="-1" aria-labelledby="newEventModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="newEventModalLabel">Create New Event</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addEventForm" action="api/create.php" method="post">
                            <div class="form-group">
                                <label for="eventTitle">Event Title <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="eventTitle" name="title" required>
                            </div>
                            <div class="form-group">
                                <label for="eventDate">Date <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="eventDate" name="date" required>
                            </div>
                            <div class="form-group">
                                <label for="eventLocation">Location <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="eventLocation" name="location" required>
                            </div>
                            <div class="form-group">
                                <label for="eventPopularity">Popularity</label>
                                <input type="number" class="form-control" id="eventPopularity" name="popularity" value="0">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" form="addEventForm" class="btn btn-success">Submit</button>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <footer class="bg-light text-center p-3 mt-4">
        <p>&copy; 2025 Events Calendar. All rights reserved.</p>
    </footer>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    </body>
</html>