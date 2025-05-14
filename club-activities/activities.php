<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getInputData() {
    return json_decode(file_get_contents('php://input'), true);
}

// Parse ID from query if provided
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;


switch ($method) {
    case 'GET':
    if ($id) {
        // Get single activity
        $stmt = $pdo->prepare("SELECT * FROM activities WHERE id = ?");
        $stmt->execute([$id]);
        $activity = $stmt->fetch();

        if ($activity) {
            // Get comments for this activity
            $stmt = $pdo->prepare("SELECT * FROM comments WHERE activity_id = ?");
            $stmt->execute([$id]);
            $activity['comments'] = $stmt->fetchAll();

            echo json_encode($activity);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Activity not found']);
        }
    } else {
        // Get all activities with their comments
        $stmt = $pdo->prepare("SELECT * FROM activities");
        $stmt->execute();
        $activities = $stmt->fetchAll();

        if ($activities) {
            // Get comments for all activities in one query
            $activityIds = array_column($activities, 'id');
            $placeholders = implode(',', array_fill(0, count($activityIds), '?'));

            $stmt = $pdo->prepare("SELECT * FROM comments WHERE activity_id IN ($placeholders)");
            $stmt->execute($activityIds);
            $allComments = $stmt->fetchAll();

            // Organize comments by activity_id
            $commentsByActivity = [];
            foreach ($allComments as $comment) {
                $commentsByActivity[$comment['activity_id']][] = $comment;
            }

            // Attach comments to each activity
            foreach ($activities as &$activity) {
                $activity['comments'] = $commentsByActivity[$activity['id']] ?? [];
            }

            echo json_encode($activities);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'No activities found']);
        }
    }
    break;

    case 'POST':
        $data = getInputData();
        // Validation
        if (empty($data['title']) || empty($data['club']) || empty($data['date']) || empty($data['category'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO activities (title, date, category, club, description) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['date'],
                $data['category'],
                $data['club'],
                $data['description'] ?? null
            ]);

            $id = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Activity created successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create activity: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Activity ID required']);
            return;
        }

        $data = getInputData();

        try {
            $stmt = $pdo->prepare("UPDATE activities SET title = ?, date = ?, category = ?, club = ?, description = ? WHERE id = ?");
            $stmt->execute([
                $data['title'],
                $data['date'],
                $data['category'],
                $data['club'],
                $data['description'] ?? null,
                $id
            ]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Activity updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Activity not found or no changes made']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update activity: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Activity ID required']);
            return;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM activities WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Activity deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Activity not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete activity: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

?>