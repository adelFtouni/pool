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
    $customerName = '';

    // Check current status of the table
    $stmt = $conn->prepare('SELECT status FROM tablee WHERE tableId = ?');
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $stmt->bind_result($currentStatus);
    $stmt->fetch();
    $stmt->close();

    // Determine action based on current status
   
    
        // Update status to 'reserved' and update customerName
        $stmt = $conn->prepare('UPDATE tablee SET status = ?, customerName = ? WHERE tableId = ?');
        $status = 'UnReserved';
        $stmt->bind_param('ssi', $status, $customerName, $tableId);
    

    // Execute the update statement
    $stmt->execute();

    // Check if update was successful
    if ($stmt->affected_rows > 0) {
        $response = [
            'success' => true,
            'message' => ($currentStatus === 'reserved' ? 'Customer name updated successfully' : 'Table reserved successfully'),
            'customerName' => $customerName
        ];
    } else {
        $response = [
            'success' => false,
            'message' => ($currentStatus === 'reserved' ? 'Failed to update customer name' : 'Failed to reserve table')
        ];
    }

    // Close statement
    $stmt->close();

    // Return JSON response
    echo json_encode($response);
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
}

// Close database connection
$conn->close();
?>
