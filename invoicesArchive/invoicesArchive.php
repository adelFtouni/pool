<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Fetch all rows from the day table where the status is 'done'
$day_sql = "SELECT id, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM day WHERE status = 'done'";
$day_result = $conn->query($day_sql);

$days = [];
if ($day_result->num_rows > 0) {
    while ($day_row = $day_result->fetch_assoc()) {
        $days[] = $day_row;
    }
}

$conn->close();

echo json_encode($days);
?>
