<?php
// Assuming database connection and configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$search = $conn->real_escape_string($_GET['search'] ?? '');
$barcode = $conn->real_escape_string($_GET['barcode'] ?? '');

if (!empty($search)) {
    // Prepare SQL statement for initial search (name or barcode match)
    $sql = "SELECT id, name, barcode, price FROM item 
            WHERE (barcode LIKE '%$search%' OR name LIKE '%$search%')";
} elseif (!empty($barcode)) {
    // Prepare SQL statement for exact barcode match
    $sql = "SELECT id, name, barcode, price FROM item 
            WHERE barcode = '$barcode'";
} else {
    // Return error for missing parameters
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Missing search or barcode parameter']);
    exit;
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $items = array();
    while ($row = $result->fetch_assoc()) {
        $items[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'barcode' => $row['barcode'],
            'price' => $row['price'],
        );
    }
    echo json_encode($items);
} else {
    echo json_encode(array()); // Return an empty array if no results found
}

$conn->close();
?>
