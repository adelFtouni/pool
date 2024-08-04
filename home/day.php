<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust * to restrict to specific origins if needed
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("success" => false, "message" => "Connection failed: " . $conn->connect_error)));
}

// Fetch the last row from the day table
$sql = "SELECT * FROM day ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

$response = array();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response = $row;
} else {
    $response['success'] = false;
    $response['message'] = "No data found in day table";
}

echo json_encode($response);
$conn->close();
?>
