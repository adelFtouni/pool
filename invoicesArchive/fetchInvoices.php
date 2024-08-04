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

// Retrieve selected date from POST request
$data = json_decode(file_get_contents('php://input'), true);
$selectedDate = isset($data['selectedDate']) ? $data['selectedDate'] : null;

if (!$selectedDate) {
    die(json_encode(array("success" => false, "message" => "Selected date not provided")));
}

// Prepare SQL statement to fetch invoices based on selected date
$sql_invoices = "SELECT invoiceId, createdAt, customerName FROM invoice WHERE dayId IN (
    SELECT id FROM day WHERE DATE(date) = ?
)";
$stmt_invoices = $conn->prepare($sql_invoices);
$stmt_invoices->bind_param("s", $selectedDate);
$stmt_invoices->execute();
$result_invoices = $stmt_invoices->get_result();

$invoices = [];
while ($row = $result_invoices->fetch_assoc()) {
    $invoiceId = $row['invoiceId'];
    $createdAt = $row['createdAt'];
    $customerName = $row['customerName'];

    // Fetch items for each invoice
    $items = [];
    $sql_items = "SELECT i.i_id, i.i_quantity,i.t_id, it.name, it.price FROM table_item i 
                  JOIN item it ON i.i_id = it.id 
                  WHERE i.invoiceId = ?";
    $stmt_items = $conn->prepare($sql_items);
    $stmt_items->bind_param("i", $invoiceId);
    $stmt_items->execute();
    $result_items = $stmt_items->get_result();

    while ($item_row = $result_items->fetch_assoc()) {
        $itemName = $item_row['name'];
        $quantity = $item_row['i_quantity'];
        $itemPrice = $item_row['price'];
        $tableId=$item_row['t_id'];
        $totalPrice = $itemPrice * $quantity;

        $items[] = [
            'itemName' => $itemName,
            'quantity' => $quantity,
            'totalPrice' => $totalPrice,
            'tableId' => $tableId
        ];
    }

    // Store invoice details
    $invoices[] = [
        'invoiceId' => $invoiceId,
        'createdAt' => $createdAt,
        'customerName' => $customerName,
        'items' => $items
    ];
}

// Close statements and connection
$stmt_invoices->close();
$conn->close();

// Prepare and return response as JSON
$response = [
    'invoices' => $invoices
];

echo json_encode($response);
?>
