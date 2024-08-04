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

if (!isset($data['id'], $data['itemBarcode'], $data['itemName'], $data['itemPrice'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

$id = intval($data['id']);
$itemBarcode = $data['itemBarcode'];
$itemName = $data['itemName'];
$itemPrice = floatval($data['itemPrice']);
$displayHome = isset($data['displayHome']) ? intval($data['displayHome']) : 0;

// Check if the barcode or name already exists for another item
$checkStmt = $conn->prepare("SELECT 1 FROM `item` WHERE (`barcode` = ? OR `name` = ?) AND `id` != ?");
$checkStmt->bind_param("ssi", $itemBarcode, $itemName, $id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Barcode or name already exists']);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Update the item
$stmt = $conn->prepare("UPDATE `item` SET `barcode` = ?, `name` = ?, `price` = ?, `display_home` = ? WHERE `id` = ?");
$stmt->bind_param("ssdii", $itemBarcode, $itemName, $itemPrice, $displayHome, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update item']);
}

$stmt->close();
$conn->close();
?>

