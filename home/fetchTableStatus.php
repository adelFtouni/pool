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
    // Get tableId from the request
    $data = json_decode(file_get_contents('php://input'), true);
    $tableId = $data['tableId'];

    // Prepare and execute SQL query to fetch table status
    $stmt = $conn->prepare('SELECT status FROM tablee WHERE tableId = ?');
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $stmt->bind_result($status);
    
    // Fetch status
    $stmt->fetch();

    // Close statement
    $stmt->close();

    // Prepare JSON response
    $response = [
        'success' => true,
        'status' => $status
    ];

    // Output JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Close database connection
$conn->close();
?>
