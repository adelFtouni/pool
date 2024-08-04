<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ادارة المخزن</title>
    <link rel="stylesheet" href="../index.css">
    <link rel="stylesheet" href="./style.css">
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
    </style>
</head>
<body>
    <div class="sidebar">
        <h1>ادارة المخزن</h1>
        <a href="../home/index.html">الصفحة الرئيسية</a>
        <a href="#">المخزن</a>
        
    </div>

    <div class="content">
        <div id="notifications"></div>
        
        <h2>اضافة صنف جديد</h2>
        <form id="itemForm">
            <label for="barcode">Barcode:</label>
            <input type="text" id="barcode" name="barcode" required>
            <label for="name">الاسم:</label>
            <input type="text" id="name" name="name" required>
            <label for="price">السعر:</label>
            <input type="text" id="price" name="price" required>
            <label for="displayHome">عرض في الشاشة الرئيسية:</label>
            <input type="checkbox" id="displayHome" name="displayHome"><br>
            <input type="submit" value="Add Item">
        </form>

        <h2>لائحة الأصناف</h2>
        <table id="itemTable">
            <thead>
                <tr>
                    <th>Barcode</th>
                    <th>الاسم</th>
                    <th>السعر</th>
                    <th>عرض في الشاشة الرئيسية</th>
                    <th>Actions</th>
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
