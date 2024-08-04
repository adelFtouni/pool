<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Query to count reserved tables
$sql = "SELECT COUNT(*) AS reserved_count FROM tablee WHERE status = 'reserved'";
$result = mysqli_query($conn, $sql);

if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}

// Fetch result as associative array
$row = mysqli_fetch_assoc($result);

// Get the count of reserved tables
$reservedCount = $row['reserved_count'];

// Close connection
mysqli_close($conn);

// Calculate the length of the array (not necessary in PHP, but here's how you could do it)
$arrayLength = count([$reservedCount]);

// Return the count and length as JSON
header('Content-Type: application/json');
echo json_encode(['reservedCount' => $reservedCount, 'length' => $arrayLength]);
?>
