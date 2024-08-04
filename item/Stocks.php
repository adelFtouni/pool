<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة المخزون</title>
    
    <link rel="stylesheet" href="./style.css">
    <style>
        .edit-mode input[type="text"], .edit-mode input[type="checkbox"], .edit-mode input[type="number"] {
            width: auto;
            margin: 0;
        }
        .edit-mode .actions button {
            display: inline-block;
        }
        .actions button {
            display: none;
        }
        .category {
            background-color: darkblue;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        a {
            text-decoration: none;
            color: white;
        }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: flex;
        }
        .sidebar {
            width: 200px;
            background-color: darkblue;
            height: 100vh;
            position: fixed;
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
        <a href="../home/index.html"><h3>إستراحة أرزة لبنان</h3></a>
        <a href="../item/Stocks.php">المخزن</a>
        <a href="../dollars/dollar.php">سعر الصرف</a>
        <a href="../sales/sales.html">مبيعات اليوم</a>
        <a href="../invoicesArchive/index.html">أرشيف الفواتير</a>
        <a href="../user/login.php" class="logout">تسجيل الخروج</a>
    </div>

    <div class="content">
        <div id="notifications"></div>
        <button class="category"><a href="./category/index.php">إضافة فئة</a></button>
        <h2>إضافة عنصر جديد</h2>

        <form id="itemForm">
            <label for="Barcode">الباركود</label>
            <input type="text" id="barcode" required>
            <label for="name">الاسم</label>
            <input type="text" id="name" required>
            <label for="price">السعر</label>
            <input type="text" id="price" required>
            <label for="quantity">الكمية</label>
            <input type="number" id="quantity" required>
            <label for="displayHome">عرض على الصفحة الرئيسية</label>
            <input type="checkbox" id="displayHome">
            <label for="category">الفئة</label>
            <select id="category" class="category-select" required>
                <option value="" disabled selected>اختر فئة</option>
            </select><br>
            <input type="submit" value="إضافة عنصر" id="submit">
        </form>

        <table id="itemTable">
            <thead>
                <tr>
                    <th>الباركود</th>
                    <th>الاسم</th>
                    <th>السعر</th>
                    <th>عرض على الصفحة الرئيسية</th>
                    <th>الفئة</th>
                    <th>الكمية</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <div id="notifications"></div>
    </div>

    <script src="script.js"></script>
</body>
</html>

