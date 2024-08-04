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

// Fetch the only row from the day table where the status is 'undone'
$day_sql = "SELECT id, date FROM day WHERE status = 'undone' LIMIT 1";
$day_result = $conn->query($day_sql);

if ($day_result->num_rows > 0) {
    $day_row = $day_result->fetch_assoc();
    $day_id = $day_row['id'];
    $day_date = $day_row['date'];
    error_log("Day query executed successfully: day_id = $day_id, date = $day_date");

    // Fetch invoices having this dayId
    $invoice_sql = "SELECT invoiceId, createdAt, customerName FROM invoice WHERE dayId = $day_id";
    $invoice_result = $conn->query($invoice_sql);

    $invoices = [];
    if ($invoice_result->num_rows > 0) {
        while ($invoice_row = $invoice_result->fetch_assoc()) {
            $invoice_id = $invoice_row['invoiceId'];
            $invoice = [
                'invoice_id' => $invoice_id,
                'createdAt' => $invoice_row['createdAt'],
                'customerName' => $invoice_row['customerName'],
                'tableId' => null, // Initialize tableId to null
                'items' => []
            ];

            // Fetch tableId from table_item for this invoice
            $table_item_sql = "SELECT t_id FROM table_item WHERE invoiceId = $invoice_id LIMIT 1";
            $table_item_result = $conn->query($table_item_sql);

            if ($table_item_result->num_rows > 0) {
                $table_item_row = $table_item_result->fetch_assoc();
                $invoice['tableId'] = $table_item_row['t_id'];
                error_log("Table ID query executed successfully: tableId = " . $invoice['tableId']);
            }

            // Fetch table items and item details for each invoice
            $table_item_sql = "SELECT i_id, i_quantity,id FROM table_item WHERE invoiceId = $invoice_id";
            $table_item_result = $conn->query($table_item_sql);

            if ($table_item_result->num_rows > 0) {
                while ($row = $table_item_result->fetch_assoc()) {
                    $item_id = $row['i_id'];
                    $quantity = $row['i_quantity'];
                    $table_item_id = $row['id'];
                    // Fetch item details from the item table (assuming table name is 'item')
                    $item_sql = "SELECT name, price FROM item WHERE id = $item_id";
                    $item_result = $conn->query($item_sql);

                    if ($item_result->num_rows > 0) {
                        $item_row = $item_result->fetch_assoc();
                        $item_name = $item_row['name'];
                        $item_price = $item_row['price'];
                        
                        $total_price = $item_price * $quantity;

                        $invoice['items'][] = [
                            'item_id' => $item_id,
                            'table_item_id'=>$table_item_id,
                            'item_name' => $item_name,
                            'quantity' => $quantity,
                            'total_price' => $total_price
                        ];

                        error_log("Item query executed successfully: item_id = $item_id, item_name = $item_name");
                    }
                }
                error_log("Table item query executed successfully for invoice_id = $invoice_id");
            }

            $invoices[] = $invoice;
            error_log("Invoice query executed successfully: invoice_id = $invoice_id");
        }
    }

    // Calculate total sales across all invoices
    $total_sales = 0;
    foreach ($invoices as $invoice) {
        foreach ($invoice['items'] as $item) {
            $total_sales += $item['total_price'];
        }
    }

    $response = [
        'success' => true,
        'day' => [
            'day_id' => $day_id,
            'day_date' => $day_date
        ],
        'invoices' => $invoices,
        'total_sales' => $total_sales
    ];

    echo json_encode($response);
} else {
    echo json_encode(['error' => 'No undone day found']);
    error_log("No undone day found");
}

$conn->close();
?>
