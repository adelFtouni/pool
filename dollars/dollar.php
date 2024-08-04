<?php
// Display the current dollar value
$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "piscine";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

$sql = "SELECT value FROM dollars WHERE id = 1";
$result = $conn->query($sql);
$currentValue = $result->fetch_assoc()['value'];

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Dollar Value</title>
    <style>
        body {
    margin: 0;
    font-family: Arial, sans-serif;
    display: flex;
}
.sidebar {
    width: 200px;
    background-color: darkblue; /* Dark blue sidebar */
    height: 100vh; /* Full height sidebar */
    position: fixed; /* Fixed position */
    top: 0;
    left: 0;
    padding-top: 20px;
    color: white;
}
.sidebar a {
    display: block;
    padding: 10px 16px;
    text-decoration: none;
    color: white;
    font-size: 18px;
}
.sidebar a:hover {
    background-color: #555;
}
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f2f5;
            font-family: Arial, sans-serif;
            margin: 0;
        }

        .update-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }

        .update-container h2 {
            margin-bottom: 20px;
            color: #333;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group button {
            width: 100%;
            padding: 10px;
            background-color: darkblue;
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .form-group button:hover {
            background-color: darkblue;
        }

        .message {
            text-align: center;
            color: #d9534f;
            margin-top: 20px;
        }
        a {
    background-color: blue;
    color: white;
    padding: 10px 15px; /* Optional: Add padding for better appearance */
    text-decoration: none; /* Optional: Remove underline */
}

a:hover {
    background-color: darkblue; /* Change background color on hover */
}

    </style>
</head>
<body>
<div class="sidebar">
        <a href="../home/index.html"><h3>إستراحة أرزة لبنان</h3></a>
        
        <a href="../item/Stocks.php">المخزن</a>
        <a href="../dollars/dollar.php">سعر الصرف</a>
        <a href="../sales/sales.html">مبيعات اليوم</a>
       
        <a href="../invoicesArchive/index.html" > أرشيف الفواتير</a>
      
    </div>
    <div class="update-container">
        <h2>سعر الصرف الحالي<span id="currentValue"><?php echo htmlspecialchars($currentValue); ?></span></h2>
        <form id="updateForm">
            <div class="form-group">
                <label for="dollar_value">السعر الجديد</label>
                <input type="number" step="0.01" id="dollar_value" name="dollar_value" required>
            </div>
            <div class="form-group">
                <button type="button" onclick="updateDollarValue()">تعديل</button>
            </div>
        </form>
        <div id="message" class="message"></div>
    </div>

    <script>
        function updateDollarValue() {
            var dollarValue = document.getElementById('dollar_value').value;

            if (dollarValue) {
                const data = { dollar_value: dollarValue };

                fetch('updatedollar.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('currentValue').innerHTML = dollarValue;
                        document.getElementById('message').innerHTML = 'Dollar value updated successfully!';
                        document.getElementById('message').style.color = 'darkblue';
                    } else {
                        document.getElementById('message').innerHTML = 'Failed to update dollar value: ' + data.message;
                        document.getElementById('message').style.color = '#d9534f';
                    }
                })
                .catch(error => {
                   
                    document.getElementById('message').innerHTML = 'An error occurred. Please try again.';
                    document.getElementById('message').style.color = '#d9534f';
                });
            } else {
        
                document.getElementById('message').innerHTML = 'Please enter a valid dollar value..';
                    document.getElementById('message').style.color = '#d9534f';
            }
        }
    </script>
</body>
</html>
