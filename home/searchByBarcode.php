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

// Retrieve barcode from query string
$barcode = $_GET['barcode'] ?? '';

if (empty($barcode)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Barcode parameter is missing']);
    exit;
}

try {
    // Prepare and execute query to retrieve item details by barcode
    $query = "SELECT id, name, barcode, price FROM items WHERE barcode = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $barcode);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch item details
    if ($result->num_rows > 0) {
        $item = $result->fetch_assoc();
        echo json_encode($item);
    } else {
        echo json_encode(null); // Return null if no item found
    }
} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Failed to fetch item by barcode: ' . $e->getMessage()]);
    exit;
} finally {
    // Close database connection
    $stmt->close();
    $conn->close();
}
?>
