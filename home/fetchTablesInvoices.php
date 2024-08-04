<?php
// Assuming you have a database connection already established
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch table IDs with invoices
$sql = "SELECT DISTINCT t_id FROM invoice"; // Assuming invoices table has a column `t_id` for table IDs

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $tableIds = array();
    while ($row = $result->fetch_assoc()) {
        $tableIds[] = $row['t_id'];
    }
    echo json_encode($tableIds); // Output only the array of table IDs
} else {
    echo json_encode(array()); // Return an empty array if no invoices found
}

$conn->close();
?>
