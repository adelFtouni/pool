<?php
// Assuming you have a database connection established
// Replace with your actual database connection details
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

// Decode JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['quantity'], $data['table_item_id'], $data['item_id'])) {
    // If required data is not provided, send error response
    http_response_code(400);
    echo json_encode(array('error' => 'Missing parameters'));
    exit;
}

$Quantity = intval($data['quantity']);
$tableItemId = intval($data['table_item_id']);
$itemId = intval($data['item_id']);

// Begin transaction for atomicity
$conn->begin_transaction();

try {
    // Update item table with adjusted quantity
    $updateItemQuery = "UPDATE item SET quantity = quantity + $Quantity WHERE id = $itemId";
    $conn->query($updateItemQuery);

    // Delete row in table_item table
    $deleteQuery = "DELETE FROM table_item WHERE id = $tableItemId";
    $conn->query($deleteQuery);

    // Commit transaction
    $conn->commit();

    echo json_encode(array('update_success' => true, 'message' => 'Invoice updated successfully'));
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();

    echo json_encode(array('update_success' => false, 'message' => 'Error updating invoice: ' . $e->getMessage()));
}

// Close database connection
$conn->close();
?>
