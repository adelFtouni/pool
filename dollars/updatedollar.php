<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$newDollarValue = $data['dollar_value'];

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "piscine";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$sql = "UPDATE dollars SET value = ? WHERE id = 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("d", $newDollarValue);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Dollar value updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
