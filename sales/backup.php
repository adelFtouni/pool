<?php
header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=sales_report.xls");
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

// Current date of download
$currentDate = date("Y-m-d H:i:s");

// Start output buffering to capture the output
ob_start();

// Output the current date at the beginning
echo "Date of Download: $currentDate\n";
echo "\n"; // Adding an empty row for spacing

echo "Table ID\tInvoice ID\tItem Name\tQuantity\tTotal Price\n";

$sql = "SELECT t_id, invoiceId, i_id, i_quantity FROM table_item WHERE invoiceId != 0";
$result = $conn->query($sql);

$tables = [];
$totalSales = 0;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $table_id = $row['t_id'];
        $invoice_id = $row['invoiceId'];
        $item_id = $row['i_id'];
        $quantity = $row['i_quantity'];

        if (!isset($tables[$table_id])) {
            $tables[$table_id] = [
                'table_id' => $table_id,
                'invoices' => []
            ];
        }

        if (!isset($tables[$table_id]['invoices'][$invoice_id])) {
            $tables[$table_id]['invoices'][$invoice_id] = [
                'invoice_id' => $invoice_id,
                'items' => []
            ];
        }

        $item_sql = "SELECT name, price FROM item WHERE id = $item_id";
        $item_result = $conn->query($item_sql);

        if ($item_result->num_rows > 0) {
            $item_row = $item_result->fetch_assoc();
            $item_name = $item_row['name'];
            $item_price = $item_row['price'];

            $total_price = $item_price * $quantity;

            $tables[$table_id]['invoices'][$invoice_id]['items'][] = [
                'item_name' => $item_name,
                'quantity' => $quantity,
                'total_price' => $total_price
            ];

            echo "$table_id\t$invoice_id\t$item_name\t$quantity\t$total_price\n";
            $totalSales += $total_price;
        }
    }
}

// Output the total sales at the end
echo "\n"; // Adding an empty row for spacing
echo "Total Sales\t\t\t\t$totalSales\n";

$conn->close();

// Capture the output and send it as the response
$output = ob_get_clean();
echo $output;
?>
