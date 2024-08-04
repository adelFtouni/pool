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
    die(json_encode(array("success" => false, "message" => "Connection failed: " . $conn->connect_error)));
}

// Get the current timestamp
$timestamp = date('Y-m-d H:i:s');

// Retrieve dayId and cName from POST request
$data = json_decode(file_get_contents('php://input'), true);
$dayId = isset($data['dayId']) ? $data['dayId'] : null;
$cName = isset($data['cName']) ? $data['cName'] : null;

// Prepare SQL statement to insert a new invoice
$sql_create = "INSERT INTO invoice (createdAt, dayId, customerName) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql_create);
$stmt->bind_param("sis", $timestamp, $dayId, $cName);

$response = array();

if ($stmt->execute()) {
    $invoiceId = $stmt->insert_id; // Get the ID of the newly inserted invoice
    $response['success'] = true;
    $response['invoiceId'] = $invoiceId;
    $response['message'] = "Invoice created successfully";
} else {
    $response['success'] = false;
    $response['message'] = "Error creating invoice: " . $stmt->error;
}

$stmt->close();
$conn->close();

// Output JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
