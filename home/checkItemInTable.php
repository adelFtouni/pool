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

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['tableId'], $data['itemId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

$tableId = $data['tableId'];
$itemId = $data['itemId'];

$stmt = $conn->prepare("SELECT i_quantity FROM table_item WHERE t_id = ? AND i_id = ? and invoiceId=0");
$stmt->bind_param("ii", $tableId, $itemId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['exists' => true, 'quantity' => $row['i_quantity']]);
} else {
    echo json_encode(['exists' => false]);
}

$stmt->close();
$conn->close();
?>
