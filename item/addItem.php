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
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['itemBarcode'], $data['itemName'], $data['itemPrice'], $data['categoryId'], $data['itemQuantity'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

$itemBarcode = $data['itemBarcode'];
$itemName = $data['itemName'];
$itemPrice = $data['itemPrice'];
$categoryId = $data['categoryId'];
$itemQuantity = $data['itemQuantity'];
$displayHome = isset($data['displayHome']) ? intval($data['displayHome']) : 0;

$checkStmt = $conn->prepare("SELECT COUNT(*) AS count FROM `item` WHERE `barcode` = ? OR `name` = ?");
$checkStmt->bind_param("ss", $itemBarcode, $itemName);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$count = $checkResult->fetch_assoc()['count'];

if ($count > 0) {
    echo json_encode(['success' => false, 'message' => 'Item with the same barcode or name already exists']);
} else {
    $insertStmt = $conn->prepare("INSERT INTO `item` (`barcode`, `name`, `price`, `display_home`, `category_id`, `quantity`) VALUES (?, ?, ?, ?, ?, ?)");
    $insertStmt->bind_param("ssdisi", $itemBarcode, $itemName, $itemPrice, $displayHome, $categoryId, $itemQuantity);

    if ($insertStmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add item']);
    }
}

$checkStmt->close();
$insertStmt->close();
$conn->close();
?>