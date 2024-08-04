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

if (!isset($data['category'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

$category = $data['category'];

$checkStmt = $conn->prepare("SELECT COUNT(*) AS count FROM `category` WHERE `name` = ?");
$checkStmt->bind_param("s", $category);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$count = $checkResult->fetch_assoc()['count'];

if ($count > 0) {
    echo json_encode(['success' => false, 'message' => 'Category with the same name already exists']);
} else {
    $insertStmt = $conn->prepare("INSERT INTO `category` (`name`) VALUES (?)");
    $insertStmt->bind_param("s", $category);

    if ($insertStmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add category']);
    }
}

$checkStmt->close();
$insertStmt->close();
$conn->close();
?>
