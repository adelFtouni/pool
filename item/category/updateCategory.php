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
    die(json_encode(['success' => false, 'message' => 'فشل الاتصال: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'], $data['categoryName'])) {
    http_response_code(400);
    echo json_encode(['error' => 'المعلمات مفقودة']);
    exit;
}

$id = intval($data['id']);
$categoryName = $data['categoryName'];

$checkStmt = $conn->prepare("SELECT 1 FROM `category` WHERE `name` = ? AND `id` != ?");
$checkStmt->bind_param("si", $categoryName, $id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'الفئة التي تحمل نفس الاسم موجودة بالفعل']);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

$stmt = $conn->prepare("UPDATE `category` SET `name` = ? WHERE `id` = ?");
$stmt->bind_param("si", $categoryName, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'فشل في تحديث الفئة']);
}

$stmt->close();
$conn->close();
?>

