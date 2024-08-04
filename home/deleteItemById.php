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

if (!isset($data['table_item_id']) || !isset($data['itemId']) || !isset($data['qty']) || !isset($data['tableId'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Missing required data (table_item_id, itemId, tableId, or qty)']);
    exit;
}

$table_item_id = (int) $data['table_item_id'];
$itemId = (int) $data['itemId'];
$quantity = (int) $data['qty'];
$tableId = (int) $data['tableId'];

// Begin transaction to ensure atomicity
$conn->begin_transaction();

try {
    // Prepare the delete statement for table_item (prevent SQL injection)
    $deleteQuery = 'DELETE FROM table_item WHERE id=?';
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bind_param('i', $table_item_id);

    // Execute the delete query
    if (!$deleteStmt->execute()) {
        throw new Exception('Failed to delete item from table_item: ' . $deleteStmt->error);
    }

    // Get the deleted table_item_id
    $deletedTableItemId = $table_item_id;

    // Prepare the update statement for items table to increment quantity
    $updateQuery = 'UPDATE item SET quantity = quantity + ? WHERE id = ?';
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param('ii', $quantity, $itemId);

    // Execute the update query
    if (!$updateStmt->execute()) {
        throw new Exception('Failed to update item quantity in items table: ' . $updateStmt->error);
    }

    // Commit the transaction
    $conn->commit();

    // Return success response with deleted table_item_id
    http_response_code(200); // OK
    echo json_encode(['success' => true, 'deleted_table_item_id' => $deletedTableItemId]);
} catch (Exception $e) {
    // Rollback the transaction on error
    $conn->rollback();

    // Return error response
    http_response_code(500); // Internal Server Error
    echo json_encode(['message' => $e->getMessage()]);
}

// Close prepared statements and database connection
$deleteStmt->close();
$updateStmt->close();
$conn->close();
?>
