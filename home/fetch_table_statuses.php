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

// Query to fetch table statuses
$sql = "SELECT tableId,status,isOpen,customerName FROM tablee";
$result = mysqli_query($conn, $sql);

$tables = array();
if (mysqli_num_rows($result) > 0) {
    // Fetch data from each row
    while ($row = mysqli_fetch_assoc($result)) {
        $tables[] = $row;
    }
}

// Close connection
mysqli_close($conn);

// Output JSON encoded data
header('Content-Type: application/json');
echo json_encode($tables);
?>
