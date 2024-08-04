<?php
// Assuming you have a database connection established
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

// Function to get message based on addedQuantity
function getMessageByItemId($itemId) {
    global $conn;
    
    // Prepare SQL statement to fetch data
    $stmt = $conn->prepare("SELECT addedQuantity FROM item WHERE id = ?");
    $stmt->bind_param("i", $itemId);
    $stmt->execute();
    $stmt->bind_result($addedQuantity);
    $stmt->fetch();
    $stmt->close();
    
    // Determine message based on addedQuantity
    if ($addedQuantity === NULL) {
        return array("message" => "good", "addedQuantity" => $addedQuantity);
    } else if ($addedQuantity === 0) {
        return array("message" => "no_more_stock", "addedQuantity" => $addedQuantity);
    } else if ($addedQuantity > 0) {
        return array("message" => "need_to_check", "addedQuantity" => $addedQuantity);
    } else {
        // Handle any other cases if needed
        return array("message" => "unknown", "addedQuantity" => $addedQuantity); // Example fallback
    }
}

// Function to fetch messages for all items
function getAllItemMessages() {
    global $conn;
    
    // Prepare SQL statement to fetch all items
    $stmt = $conn->prepare("SELECT id FROM item");
    $stmt->execute();
    $stmt->bind_result($itemId);
    
    $items = array();
    
    // Fetch each item and get its message
    while ($stmt->fetch()) {
        $messageData = getMessageByItemId($itemId);
        $messageData['id'] = $itemId;
        $items[] = $messageData;
    }
    
    $stmt->close();
    
    return $items;
}

// Main logic to handle the POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Assuming item_id is sent in the request body as JSON
    $requestData = json_decode(file_get_contents("php://input"), true);
    
    if (isset($requestData['item_id'])) {
        $itemId = $requestData['item_id'];
        
        // Fetch message for the specified item_id
        $messageData = getMessageByItemId($itemId);
        $messageData['id'] = $itemId;
        
        echo json_encode($messageData);
    } else {
        echo json_encode(array("error" => "Item ID not provided"));
    }
} else {
    // Fetch messages for all items if no specific item_id provided
    $allItemsMessages = getAllItemMessages();
    echo json_encode($allItemsMessages);
}

$conn->close();
?>
