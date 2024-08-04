<?php
// Ensure the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    // Replace with your database connection details
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "piscine";
    
    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    // Prepare POST data
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['invoiceId']) || !isset($data['arrayOfData'])) {
        // If required data is not provided, send error response
        http_response_code(400);
        echo json_encode(array('error' => 'Missing parameters'));
        exit;
    }
    
    $invoiceId = intval($data['invoiceId']);
    $arrayOfData = $data['arrayOfData'];
    
    // Start transaction to ensure data integrity
    mysqli_begin_transaction($conn);
    
    try {
        // Process each item in the array
        foreach ($arrayOfData as $item) {
            $item_id = intval($item['item_id']);
            $table_item_id = intval($item['table_item_id']);
            $quantity = intval($item['quantity']);
            
            // Update quantity in the item table
            $update_item_sql = "UPDATE item SET quantity = quantity + $quantity WHERE id = $item_id";
            mysqli_query($conn, $update_item_sql);
            
            // Delete rows from table_item table
            $delete_table_item_sql = "DELETE FROM table_item WHERE i_id = $item_id AND id = $table_item_id";
            mysqli_query($conn, $delete_table_item_sql);
        }
        
        // Delete invoice from invoice table
        $delete_invoice_sql = "DELETE FROM invoice WHERE invoiceId = $invoiceId";
        mysqli_query($conn, $delete_invoice_sql);
        
        // Commit the transaction
        mysqli_commit($conn);
        
        // If all queries executed successfully, return success response
        $response = array(
            'update_success' => true,
            'message' => 'Invoice deleted successfully'
        );
        
    } catch (Exception $e) {
        // Rollback the transaction if any query fails
        mysqli_rollback($conn);
        
        // Return error message
        $response = array(
            'update_success' => false,
            'message' => 'Error deleting invoice: ' . $e->getMessage()
        );
    }
    
    // Send JSON response back to client
    header('Content-Type: application/json');
    echo json_encode($response);
    
    // Close connection
    mysqli_close($conn);
} else {
    // Return error if the request method is not POST
    $response = array(
        'update_success' => false,
        'message' => 'Invalid request method'
    );
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
