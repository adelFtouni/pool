<?php
// Connect to your database (replace with your connection details)
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

// Check if request method is POST and data is received
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty(file_get_contents('php://input'))) {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Invalid request method or missing data']);
    exit;
}

// Get the data from the request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['tableId']) || !isset($data['itemId']) || !isset($data['itemQuantity']) || !isset($data['table_item_id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['message' => 'Missing required data (tableId, itemId, or itemQuantity)']);
    exit;
}

$tableId = (int) $data['tableId'];
$itemId = (int) $data['itemId'];
$itemQuantity = (int) $data['itemQuantity'];
$table_item_id = (int)$data['table_item_id'];
// Start a transaction
$conn->begin_transaction();

try {
    // Fetch current quantity from table_item
    $stmtFetch = $conn->prepare("SELECT i_quantity FROM table_item WHERE t_id = ? AND i_id = ? and id=?");
    $stmtFetch->bind_param("iii", $tableId, $itemId,$table_item_id);
    $stmtFetch->execute();
    $stmtFetch->bind_result($currentQuantity);
    $stmtFetch->fetch();
    $stmtFetch->close();

    if ($currentQuantity === null) {
        http_response_code(404); // Not Found
        echo json_encode(['message' => 'Item not found in table_item']);
        exit;
    }

    // Determine if quantity should be increased or decreased
    if ($itemQuantity > $currentQuantity) {
        // Case 1: Increase quantity in table_item and decrease in item table
        $increaseAmount = $itemQuantity - $currentQuantity;

        // Update table_item
        $stmtUpdateTableItem = $conn->prepare("UPDATE table_item SET i_quantity = i_quantity + ? WHERE t_id = ? AND i_id = ? and id=?");
        $stmtUpdateTableItem->bind_param("iiii", $increaseAmount, $tableId, $itemId,$table_item_id);
        $stmtUpdateTableItem->execute();
        $stmtUpdateTableItem->close();

        // Decrease item table
        $stmtUpdateItem = $conn->prepare("UPDATE item SET quantity = quantity - ? WHERE id = ?");
        $stmtUpdateItem->bind_param("ii", $increaseAmount, $itemId);
        $stmtUpdateItem->execute();
        $stmtUpdateItem->close();

        // Fetch new quantity from item table
        $stmtFetchNewItemQuantity = $conn->prepare("SELECT quantity FROM item WHERE id = ?");
        $stmtFetchNewItemQuantity->bind_param("i", $itemId);
        $stmtFetchNewItemQuantity->execute();
        $stmtFetchNewItemQuantity->bind_result($newItemQuantity);
        $stmtFetchNewItemQuantity->fetch();
        $stmtFetchNewItemQuantity->close();

        $result = ['item_id' => $itemId, 'table_item_quantity' => $currentQuantity + $increaseAmount, 'item_quantity' => $newItemQuantity];

    } elseif ($itemQuantity < $currentQuantity) {
        // Case 2: Decrease quantity in both table_item and item table
        $decreaseAmount = $currentQuantity - $itemQuantity;

        // Update table_item
        $stmtUpdateTableItem = $conn->prepare("UPDATE table_item SET i_quantity = i_quantity - ? WHERE t_id = ? AND i_id = ? and id=?");
        $stmtUpdateTableItem->bind_param("iiii", $decreaseAmount, $tableId, $itemId,$table_item_id);
        $stmtUpdateTableItem->execute();
        $stmtUpdateTableItem->close();

        // Increase item table
        $stmtUpdateItem = $conn->prepare("UPDATE item SET quantity = quantity + ? WHERE id = ?");
        $stmtUpdateItem->bind_param("ii", $decreaseAmount, $itemId);
        $stmtUpdateItem->execute();
        $stmtUpdateItem->close();

        // Fetch new quantity from item table
        $stmtFetchNewItemQuantity = $conn->prepare("SELECT quantity FROM item WHERE id = ?");
        $stmtFetchNewItemQuantity->bind_param("i", $itemId);
        $stmtFetchNewItemQuantity->execute();
        $stmtFetchNewItemQuantity->bind_result($newItemQuantity);
        $stmtFetchNewItemQuantity->fetch();
        $stmtFetchNewItemQuantity->close();

        $result = ['item_id' => $itemId, 'table_item_quantity' => $currentQuantity - $decreaseAmount, 'item_quantity' => $newItemQuantity];
    } else {
        // No change needed
        $stmtFetchNewItemQuantity = $conn->prepare("SELECT quantity FROM item WHERE id = ?");
        $stmtFetchNewItemQuantity->bind_param("i", $itemId);
        $stmtFetchNewItemQuantity->execute();
        $stmtFetchNewItemQuantity->bind_result($newItemQuantity);
        $stmtFetchNewItemQuantity->fetch();
        $stmtFetchNewItemQuantity->close();

        $result = ['item_id' => $itemId, 'table_item_quantity' => $currentQuantity, 'item_quantity' => $newItemQuantity];
    }

    // Determine status based on item_quantity
    if ($result['item_quantity'] > 0) {
        $status = ['status' => 'good', 'message' => 'Item quantity is greater than 0'];
    } elseif ($result['item_quantity'] === 0) {
        $status = ['status' => 'no_more_stock', 'message' => 'No more stock available for this item'];
    } else {
        $status = ['status' => 'need_to_check', 'message' => 'Quantity is negative, needs checking'];
    }

    // Commit transaction if all queries were successful
    $conn->commit();

    http_response_code(200); // OK
    echo json_encode(['success' => true, 'result' => $result, 'status' => $status]);
} catch (Exception $e) {
    // Rollback the transaction if any error occurred
    $conn->rollback();

    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Failed to update item quantity: ' . $e->getMessage()]);
}

// Close database connection
$conn->close();
?>
