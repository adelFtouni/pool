<?php
session_start(); // Start the session

$servername = "localhost";
$dbUsername = "root"; // Your database username
$dbPassword = ""; // Your database password
$dbname = "piscine";

// Create connection
$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$postUsername = $_POST['username'];
$postPassword = $_POST['password'];

// Query user
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $postUsername);
$stmt->execute();
$result = $stmt->get_result();

$response = array();
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // Verify password
    if ($postPassword === $row['password']) {
        // Set session variables
        $_SESSION['username'] = $postUsername;
        
        // Indicate success
        $response['status'] = 'success';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Invalid username or password.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid username or password.';
}

$stmt->close();
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>





