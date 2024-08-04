<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "piscine";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Delete all rows from table_item
$sql_delete_table_item = "DELETE FROM table_item";
if ($conn->query($sql_delete_table_item) === TRUE) {
    echo "Deleted all rows from table_item successfully. ";
} else {
    echo "Error deleting rows from table_item: " . $conn->error;
}

// Delete all rows from invoice
$sql_delete_invoice = "DELETE FROM invoice";
if ($conn->query($sql_delete_invoice) === TRUE) {
    echo "Deleted all rows from invoice successfully. ";
} else {
    echo "Error deleting rows from invoice: " . $conn->error;
}

$conn->close();
?>
