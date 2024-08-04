<?php
header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, barcode, name, price, display_home FROM item";
$result = $conn->query($sql);

$items = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Adjust display_home value for clarity
        $row['display_home'] = $row['display_home'] == 1 ? 'Yes' : 'No'; // Display 'Yes' if display_home is 1, otherwise 'No'
        $items[] = $row;
    }
}

echo json_encode($items);

$conn->close();
?>





