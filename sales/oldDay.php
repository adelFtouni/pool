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
$day_id = isset($data['day_id']) ? $data['day_id'] : null;
$rate = isset($data['rate']) ? $data['rate'] : 0;
$totalSalesLbpValue = isset($data['totalSalesLbpValue']) ? $data['totalSalesLbpValue'] : 0;
$totalSalesDollarValue = isset($data['totalSalesDollarValue']) ? $data['totalSalesDollarValue'] : 0;

$response = array();


    // Update the status, rate, totalSalesLbpValue, and totalSalesDollarValue of the given day_id to 'done'
    $sql_update = "UPDATE day SET status = 'done', rate = ?, totalDollar = ?, totalLira = ? WHERE id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("dddi", $rate, $totalSalesDollarValue, $totalSalesLbpValue, $day_id);

    if ($stmt_update->execute()) {
        $response['update_success'] = true;
        error_log("Day status updated successfully: day_id = $day_id");
    } else {
        $response['update_success'] = false;
        $response['message'] = "Error updating day status: " . $stmt_update->error;
    }

    $stmt_update->close();


echo json_encode($response);
$conn->close();
?>
