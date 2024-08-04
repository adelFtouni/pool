<?php
// Database connection details
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

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get tableId and customerName from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $tableId = $data['tableId'];
    $customerName = $data['customerName']; // Added line to get customerName

    // Check current status of the table
    $stmt = $conn->prepare('SELECT status FROM tablee WHERE tableId = ?');
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $stmt->bind_result($currentStatus);
    $stmt->fetch();
    $stmt->close();

    if ($currentStatus === 'reserved') {
        // If the table is already reserved, update the customer name only
        $stmt = $conn->prepare('UPDATE tablee SET customerName = ? WHERE tableId = ?');
        $stmt->bind_param('si', $customerName, $tableId);
        $stmt->execute();

        // Check if update was successful
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Customer name updated successfully', 'customerName' => $customerName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update customer name']);
        }
        $stmt->close();
    } else {
        // Update table status to 'reserved'
        $status = 'reserved';
        $stmt = $conn->prepare('UPDATE tablee SET status = ?, customerName = ? WHERE tableId = ?');
        $stmt->bind_param('ssi', $status, $customerName, $tableId); // Updated to bind customerName
        $stmt->execute();

        // Check if update was successful
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Table reserved successfully', 'customerName' => $customerName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to reserve table']);
        }
        $stmt->close();
    }
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Close database connection
$conn->close();
?>
