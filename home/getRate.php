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
$currentValue = $result->fetch_assoc()['value'];
echo $currentValue;
$conn->close();
?>