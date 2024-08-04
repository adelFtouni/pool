<?php
// Assuming you have a database connection established already
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
// Check if the request method is GET and tableId is provided
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['tableId'])) {
    $tableId = $_GET['tableId'];

    // Create connection (assuming mysqli for this example)
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

    // Fetch items associated with the table from table_item table
    $stmt = $conn->prepare('SELECT ti.id, ti.i_id, ti.i_quantity, ti.createdAt
FROM table_item ti
JOIN tablee te ON ti.t_id = te.tableId
WHERE ti.t_id = ? 
  AND ti.invoiceId = 0
  AND te.status = "reserved"');
    $stmt->bind_param('i', $tableId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Prepare an array to store fetched items
    $tableItems = [];

    // Fetch items as associative array
    while ($row = $result->fetch_assoc()) {
        $tableItems[] = $row;
    }

    // Close statement and database connection
    $stmt->close();
    $conn->close();

    // Return JSON response
    echo json_encode($tableItems);
} else {
    // Handle invalid request method or missing parameters
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid request']);
}
?>
