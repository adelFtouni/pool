<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة المخزون</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .edit-mode input[type="text"], .edit-mode input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        .edit-mode .actions button {
            display: inline-block;
        }
        .actions button {
            display: none;
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
    background-color: blue;
}
    </style>
</head>
<body>
<div class="sidebar">
        <a href="../../home/index.html"><h3>إستراحة أرزة لبنان</h3></a>
        
        <a href="../Stocks.php">المخزن</a>
        <a href="../../dollars/dollar.php">سعر الصرف</a>
        <a href="../../sales/sales.html">مبيعات اليوم</a>
       
        <a href="../../invoicesArchive/index.html" > أرشيف الفواتير</a>
        <a href="../../user/login.php" class="logout">تسجيل الخروج</a>
    </div>
    <div class="content">
        <div id="notifications"></div>
        
        <h2>إضافة فئة</h2>
        <form id="itemForm">
            <label for="category">الفئة</label>
            <input type="text" id="category" name="category" required>
            <input type="submit" value="إضافة فئة">
        </form>

        <h2>قائمة الفئات</h2>
        <table id="itemTable">
            <thead>
                <tr>
                    <th>الاسم</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table rows will be dynamically generated -->
            </tbody>
        </table>
    </div>

    <script src="script.js"></script>
</body>
</html>
