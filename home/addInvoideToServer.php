<?php
// Connect to your database (replace with your connection details)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if request method is POST and data is received
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty(file_get_contents('php://input'))) {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Invalid request method or missing data']);
    exit;
}

// Get the data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['tableId']) || !isset($data['items']) || !is_array($data['items'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Missing required data (tableId or items)']);
    exit;
}

$tableId = (int) $data['tableId'];
$items = $data['items'];

// Start transaction
$conn->begin_transaction();

$responseMessages = [];

try {
    // Insert each item into the invoice table
    $stmt = $conn->prepare('INSERT INTO invoice (t_id, i_id, i_name, i_quantity, i_price, i_total_Price, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())');
    foreach ($items as $item) {
        $itemId = (int) $item['id'];
        $itemName = $item['name'];
        $quantity = (int) $item['quantity'];
        $price = (float) $item['price'];
        $totalPrice = (float) $item['totalPrice'];
        $stmt->bind_param('iisidd', $tableId, $itemId, $itemName, $quantity, $price, $totalPrice);
        $stmt->execute();
    }
    $stmt->close();
    
    $responseMessages[] = "Invoice added successfully to the invoice table.";

    // Delete items from table_item for the given tableId
    $deleteStmt = $conn->prepare('DELETE FROM table_item WHERE t_id = ?');
    $deleteStmt->bind_param('i', $tableId);
    $deleteStmt->execute();
    $deleteStmt->close();
    
    $responseMessages[] = "All rows deleted successfully from table_item table.";

    // Commit transaction
    $conn->commit();

    // Return success response
    http_response_code(200); // OK
    echo json_encode(['success' => true, 'messages' => $responseMessages]);
} catch (Exception $e) {
    // Rollback transaction
    $conn->rollback();

    // Return error response
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to add invoice: ' . $e->getMessage()]);
}

// Close database connection
$conn->close();
?>
