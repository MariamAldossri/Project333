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
            // Get a single product
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if ($product) {
                // Get reviews for this product
                $stmt = $pdo->prepare("SELECT * FROM reviews WHERE product_id = ?");
                $stmt->execute([$id]);
                $product['reviews'] = $stmt->fetchAll();
                echo json_encode($product);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } else {
            // Get all products with their reviews
            $stmt = $pdo->prepare("SELECT * FROM products");
            $stmt->execute();
            $products = $stmt->fetchAll();
            if ($products) {
                // Get reviews for all products in one query
                $productIds = array_column($products, 'id');
                $placeholders = implode(',', array_fill(0, count($productIds), '?'));
                $stmt = $pdo->prepare("SELECT * FROM reviews WHERE product_id IN ($placeholders)");
                $stmt->execute($productIds);
                $allReviews = $stmt->fetchAll();

                // Organize reviews by product_id
                $reviewsByProduct = [];
                foreach ($allReviews as $review) {
                    $reviewsByProduct[$review['product_id']][] = $review;
                }

                // Attach reviews to each product
                foreach ($products as &$product) {
                    $product['reviews'] = $reviewsByProduct[$product['id']] ?? [];
                }

                echo json_encode($products);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No products found']);
            }
        }
        break;

    case 'POST':
        $data = getInputData();
        // Validation
        if (empty($data['name']) || empty($data['price']) || empty($data['seller']) || empty($data['description'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        try {
            $stmt = $pdo->prepare("INSERT INTO products (name, price, seller, description) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['price'],
                $data['seller'],
                $data['description']
            ]);
            $id = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Product created successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create product: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID required']);
            return;
        }
        $data = getInputData();
        try {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, seller = ?, description = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['price'],
                $data['seller'],
                $data['description'],
                $id
            ]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Product updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found or no changes made']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID required']);
            return;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Product deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
