<?php
// Display the current dollar value
$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "piscine";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

$sql = "SELECT value FROM dollars WHERE id = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $currentValue = $result->fetch_assoc()['value'];
    echo $currentValue;
} else {
    echo "No dollar value found";
}

$conn->close();
?>
