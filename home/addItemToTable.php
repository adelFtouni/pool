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

if (!isset($data['tableId'], $data['itemId'], $data['itemQuantity'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

$tableId = $data['tableId'];
$itemId = $data['itemId'];
$itemQuantity = $data['itemQuantity'];


// Insert into table_item and capture the createdAt field
$stmt = $conn->prepare("INSERT INTO table_item (t_id, i_id, i_quantity) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $tableId, $itemId, $itemQuantity);

$insertSuccess = $stmt->execute();

if ($insertSuccess) {
    $lastInsertedId = $stmt->insert_id; // Get the ID of the inserted row
    
    // Fetch the createdAt timestamp of the inserted row
    $stmt = $conn->prepare("SELECT createdAt FROM table_item WHERE id = ?");
    $stmt->bind_param("i", $lastInsertedId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $createdAt = $row['createdAt'];
        
        // Decrease quantity in item table
        $stmt = $conn->prepare("UPDATE item SET quantity = quantity - ? WHERE id = ?");
        $stmt->bind_param("ii", $itemQuantity, $itemId);

        $updateSuccess = $stmt->execute();
        $stmt->close();

        if ($updateSuccess) {
            // Fetch the inserted item details
            $stmt = $conn->prepare("SELECT id, barcode, name, price FROM item WHERE id = ?");
            $stmt->bind_param("i", $itemId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $item = $result->fetch_assoc();
                $item['i_quantity'] = $itemQuantity;
                $item['createdAt'] = $createdAt; // Add the fetched createdAt field to the response
                $item['table_item_id'] = $lastInsertedId; // Add the inserted table_item ID to the response
                echo json_encode(['success' => true, 'item' => $item]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Item not found']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update item quantity']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch createdAt']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add new item']);
}

$conn->close();
?>
