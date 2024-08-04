<?php
// Assuming you have a database connection established already
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
    // Get tableId and isOpen from the request body
    $data = json_decode(file_get_contents('php://input'), true);
    $tableId = $data['tableId'];
    $isOpen = $data['isOpen']; // isOpen will be 'opened' or 'closed'

    // Update table status in the database
    $stmt = $conn->prepare('UPDATE tablee SET isOpen = ? WHERE tableId = ?');
    $stmt->bind_param('si', $isOpen, $tableId);
    $stmt->execute();

    // Check if update was successful
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Table status updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update table status']);
    }
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Close database connection
$conn->close();
?>
