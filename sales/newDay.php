<?php
header('Content-Type: application/json');

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

// Retrieve data from POST request
$data = json_decode(file_get_contents('php://input'), true);
$rate = isset($data['rate']) ? $data['rate'] : null;

$response = array();

if ($rate !== null) {
    // Insert a new row into the day table with the given rate
    $sql_insert = "INSERT INTO day (rate) VALUES (?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("d", $rate); // Assuming rate is a decimal value

    if ($stmt_insert->execute()) {
        $new_day_id = $stmt_insert->insert_id; // Get the ID of the newly inserted row
        $response['insert_success'] = true;
        $response['new_day_id'] = $new_day_id;
        error_log("New day added successfully: new_day_id = $new_day_id");
    } else {
        $response['insert_success'] = false;
        $response['message'] = "Error inserting new day rate: " . $stmt_insert->error;
    }

    $stmt_insert->close();
} else {
    $response['success'] = false;
    $response['message'] = "Invalid input data";
}

echo json_encode($response);
$conn->close();
?>
