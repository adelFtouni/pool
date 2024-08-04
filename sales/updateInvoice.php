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

if (!isset($data['newQuantity'], $data['table_item_id'], $data['item_id'], $data['oldQuantity'])) {
    // If required data is not provided, send error response
    http_response_code(400);
    echo json_encode(array('error' => 'Missing parameters'));
    exit;
}

$newQuantity = intval($data['newQuantity']);
$tableItemId = intval($data['table_item_id']);
$itemId = intval($data['item_id']);
$oldQuantity = intval($data['oldQuantity']);

// Begin transaction for atomicity
$conn->begin_transaction();

try {
    if ($oldQuantity > $newQuantity) {
        // Calculate difference
        $difference = $oldQuantity - $newQuantity;

        // Update item table with adjusted quantity
        $updateItemQuery = "UPDATE item SET quantity = quantity + $difference WHERE id = $itemId";
        $conn->query($updateItemQuery);

        // Update table_item table
        $updateTableItemQuery = "UPDATE table_item SET i_quantity = $newQuantity WHERE id = $tableItemId";
        $conn->query($updateTableItemQuery);
    } elseif ($oldQuantity < $newQuantity) {
        // Calculate difference
        $difference = $newQuantity - $oldQuantity;

        // Update item table with adjusted quantity
        $updateItemQuery = "UPDATE item SET quantity = quantity - $difference WHERE id = $itemId";
        $conn->query($updateItemQuery);

        // Update table_item table
        $updateTableItemQuery = "UPDATE table_item SET i_quantity = $newQuantity WHERE id = $tableItemId";
        $conn->query($updateTableItemQuery);
    } else {
        // Quantities are equal, no update needed
        $conn->rollback(); // Rollback since no actual update was performed
        echo json_encode(array('update_success' => false, 'message' => 'Failed to update: Quantities are equal'));
        exit;
    }

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
