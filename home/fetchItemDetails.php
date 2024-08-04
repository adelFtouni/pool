<?php
// Assuming you have a database connection established already

// Check if the request method is GET and itemId is provided
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['itemId']) && isset($_GET['table_item_id'])) {
    $itemId = $_GET['itemId'];
    $table_item_id=$_GET['table_item_id'];
    // Database connection parameters
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

    // Prepare SQL statement with JOIN
    $stmt = $conn->prepare('
        SELECT i.name, i.price, i.barcode, ti.i_quantity, ti.createdAt
        FROM item i
        INNER JOIN table_item ti ON i.id = ti.i_id
        WHERE i.id = ? and ti.id=?
    ');
    $stmt->bind_param('ii', $itemId,$table_item_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch item details as associative array
    $itemDetails = $result->fetch_assoc();

    // Close statement and database connection
    $stmt->close();
    $conn->close();

    // Return JSON response
    echo json_encode($itemDetails);
} else {
    // Handle invalid request method or missing parameters
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid request']);
}
?>

