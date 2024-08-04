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
    // Get tableId from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $tableId = $data['tableId'];

    // Check current status of the table
    $stmt = $conn->prepare('SELECT status FROM tablee WHERE tableId = ?');
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $stmt->bind_result($currentStatus);
    $stmt->fetch();
    $stmt->close();

    if ($currentStatus === 'notReserved') {
        // If the table is already reserved, return a message and do nothing
        echo json_encode(['success' => false, 'message' => 'Table already notReserved']);
    } else {
        // Update table status to 'reserved'
        $status = 'notReserved';
        $stmt = $conn->prepare('UPDATE tablee SET status = ? WHERE tableId = ?');
        $stmt->bind_param('si', $status, $tableId);
        $stmt->execute();

        // Check if update was successful
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'now table is not reserved']);
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

