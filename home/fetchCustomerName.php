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
    // Get tableId from POST data
    $data = json_decode(file_get_contents('php://input'), true);
    $tableId = $data['tableId'];

    // Validate tableId (optional)
    if (!isset($tableId) || !is_numeric($tableId)) {
        echo json_encode(['success' => false, 'message' => 'Invalid table ID']);
        exit;
    }

    // Prepare statement to fetch customer name
    $stmt = $conn->prepare('SELECT customerName FROM tablee WHERE tableId = ?');
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $stmt->bind_result($customerName);
    $stmt->fetch();
    $stmt->close();

    // Check if customerName is empty
    if ($customerName === null) {
        echo json_encode(['success' => false, 'message' => 'No customer set for this table']);
    } else {
        echo json_encode(['success' => true, 'customerName' => $customerName]);
    }
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Close database connection
$conn->close();
?>
