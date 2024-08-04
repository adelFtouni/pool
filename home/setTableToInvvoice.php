<?php
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the posted data
$postData = file_get_contents('php://input');
$request = json_decode($postData, true);

// Extract id and invoiceId from the request
$tableId = $request['tableId'];
$invoiceId = $request['invoiceId'];

// Prepare the SQL update statement
$sql = "UPDATE table_item SET invoiceId = ? WHERE t_id = ? and invoiceId=0";

// Prepare and bind
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $invoiceId, $tableId);

// Execute the query
if ($stmt->execute()) {
    $response = [
        "query" => $stmt->get_result(),
        "message" => "Invoice ID in table_item table updated successfully",
        "query"=>$sql,
        "tableId"=>$tableId,
        "invoiceId"=>$invoiceId
    ];
} else {
    $response = [
        "error" => "Error updating record: " . $conn->error
    ];
}

// Close the statement and connection
$stmt->close();
$conn->close();

// Return the response as JSON
echo json_encode($response);
?>
