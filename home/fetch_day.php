<?php
// Database connection
$servername = "localhost"; // Replace with your database hostname
$username = "root";    // Replace with your database username
$password = "";    // Replace with your database password
$dbname = "piscine"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data from 'day' table
$sql = "SELECT id FROM day where status = 'undone'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo "0 results";
}

$conn->close();
?>
