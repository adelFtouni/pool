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
    // Update all tables to closed status
    $status = 'closed';
    $stmt = $conn->prepare('UPDATE tablee SET isOpen = ? WHERE isOpen = "opened"');
    $stmt->bind_param('s', $status);
    $stmt->execute();

    // Check if update was successful
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'All tables closed successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No tables were open or failed to close tables']);
    }
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Close database connection
$conn->close();
?>
