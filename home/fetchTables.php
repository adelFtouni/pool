<?php
// Database connection settings
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch tables
$sql = "SELECT tableId, status,customerName FROM tablee";

$result = $conn->query($sql);

$tables = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $tables[] = $row;
    }
}

// Close connection
$conn->close();

// Return tables data as JSON
header('Content-Type: application/json');
echo json_encode($tables);
?>
