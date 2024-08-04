<?php
header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['tableId'], $data['itemId'], $data['itemQuantity'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

$tableId = $data['tableId'];
$itemId = $data['itemId'];
$itemQuantity = $data['itemQuantity'];

// Start a transaction
$conn->begin_transaction();

try {
    // Update table_item with the new quantity
    $stmt = $conn->prepare("UPDATE table_item SET i_quantity = ? WHERE t_id = ? AND i_id = ?");
    $stmt->bind_param("iii", $itemQuantity, $tableId, $itemId);
    $stmt->execute();
    $stmt->close();

    // Decrease quantity in item table
    $stmt = $conn->prepare("UPDATE item SET quantity = quantity - 1 WHERE id = ?");
    $stmt->bind_param("i", $itemId);
    $stmt->execute();
    $stmt->close();

    // Commit transaction if all queries were successful
    $conn->commit();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    // Rollback the transaction if any error occurred
    $conn->rollback();

    echo json_encode(['success' => false, 'message' => 'Failed to update item: ' . $e->getMessage()]);
}

$conn->close();
?>
