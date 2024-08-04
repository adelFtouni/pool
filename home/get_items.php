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

$sql = "SELECT item.id, item.barcode, item.name, item.price, item.display_home, item.quantity, item.addedQuantity, category.id as category_id, category.name as category_name 
        FROM item 
        JOIN category ON item.category_id = category.id";

$result = $conn->query($sql);

$fullItems = [];
$idQuantityItems = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Full item details array
        $fullItems[] = [
            'id' => $row['id'],
            'barcode' => $row['barcode'],
            'name' => $row['name'],
            'price' => $row['price'],
            'display_home' => $row['display_home'],
            'quantity' => $row['quantity'],
         
            'category_id' => $row['category_id'],
            'category_name' => $row['category_name']
        ];

        // Simplified id and quantity object array
        $idQuantityItems[] = [
            'id' => $row['id'],
            'quantity' => $row['quantity'],
            'addedQuantity' => $row['addedQuantity']
        ];
    }
}

$response = [
    'fullItems' => $fullItems,
    'idQuantityItems' => $idQuantityItems
];

echo json_encode($response);

$conn->close();
?>
