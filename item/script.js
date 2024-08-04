// Function to edit an item
function editItem(row, id, barcode, name, price, displayHome, category, quantity) {
    row.classList.add('edit-mode');

    const barcodeCell = row.cells[0];
    const nameCell = row.cells[1];
    const priceCell = row.cells[2];
    const displayHomeCell = row.cells[3];
    const categoryCell = row.cells[4];
    const quantityCell = row.cells[5];
    const actionCell = row.cells[6];

    barcodeCell.innerHTML = `<input type="text" value="${barcode}" class="edit-barcode">`;
    nameCell.innerHTML = `<input type="text" value="${name}" class="edit-name">`;
    priceCell.innerHTML = `<input type="text" value="${price}" class="edit-price">`;
    displayHomeCell.innerHTML = `<input type="checkbox" class="edit-displayHome" ${displayHome == "1" ? 'checked' : ''}>`;
    quantityCell.innerHTML = `<input type="number" value="${quantity}" class="edit-quantity">`;

    categoryCell.innerHTML = `<select name="category" class="edit-category" required>
                <option value="" disabled>اختر فئة</option>
            </select>`;

    loadCategories(row, category); // Call loadCategories to populate the select element

    actionCell.innerHTML = `
        <button class="save-button">حفظ</button>
        <button class="cancel-button">إلغاء</button>
    `;

    actionCell.querySelector('.save-button').addEventListener('click', () => saveItem(row, id));
    // actionCell.querySelector('.cancel-button').addEventListener('click', () => cancelEdit(row, barcode, name, price, displayHome, category, quantity));
    actionCell.querySelector('.cancel-button').addEventListener('click', () => window.location.reload());
}

// Function to save an item
function saveItem(row, id) {
    const barcode = row.querySelector('.edit-barcode').value;
    const name = row.querySelector('.edit-name').value;
    const price = row.querySelector('.edit-price').value;
    const displayHome = row.querySelector('.edit-displayHome').checked ? 1 : 0;
    const categoryID = row.querySelector('.edit-category').value;
    const quantity = row.querySelector('.edit-quantity').value;

    if (barcode && name && price && !isNaN(price) && categoryID && quantity) {
        const data = {
            id: id,
            itemBarcode: barcode,
            itemName: name,
            itemPrice: price,
            displayHome: displayHome,
            itemQuantity: quantity,
            categoryID: categoryID
        };

        fetch('update_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNotification('تم تحديث العنصر بنجاح');
                loadItems();
            } else {
                displayNotification(data.message || 'فشل في تحديث العنصر', false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('فشل في تحديث العنصر', false);
        });
    } else {
        console.log('يرجى إدخال تفاصيل صحيحة.');
    }
}

// Function to load categories and set the selected category
function loadCategories(row = null, currentCategory = '') {
    fetch('getCategory.php')
        .then(response => response.json())
        .then(categories => {
            const categorySelectElements = row ? [row.querySelector('.edit-category')] : document.querySelectorAll('.category-select');
            categorySelectElements.forEach(categorySelect => {
                categorySelect.innerHTML = '<option value="" disabled>اختر فئة</option>'; // Reset options
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    if (category.name === currentCategory) {
                        option.selected = true;
                    }
                    categorySelect.appendChild(option);
                });
            });
        })
        .catch(error => console.error('خطأ في تحميل الفئات:', error));
}

// Function to delete an item
function deleteItem(id) {
    fetch('delete_item.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayNotification('تم حذف العنصر بنجاح', true);
            loadItems();
        } else {
            displayNotification(data.message || 'فشل في حذف العنصر', false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayNotification('فشل في حذف العنصر', false);
    });
}

// Function to add an item
function addItem(event) {
    event.preventDefault();

    const barcode = document.getElementById('barcode').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const categoryId = document.getElementById('category').value;
    const displayHome = document.getElementById('displayHome').checked ? 1 : 0;

    if (barcode && name && price && !isNaN(price) && categoryId && quantity) {
        const data = {
            itemBarcode: barcode,
            itemName: name,
            itemPrice: price,
            displayHome: displayHome,
            itemQuantity: quantity,
            categoryId: categoryId
        };

        fetch('addItem.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNotification('تمت إضافة العنصر بنجاح', true);
                loadItems();
                document.getElementById('itemForm').reset();
            } else {
                displayNotification(data.message || 'فشل في إضافة العنصر', false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('عنصر بنفس الباركود أو الاسم موجود بالفعل', false);
        });
    } else {
        alert('يرجى إدخال تفاصيل صحيحة.');
    }
}

// Function to display notifications
function displayNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isSuccess ? 'darkblue' : 'red'; // Dark blue for success, red for failure
    document.getElementById('notifications').appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to load items
function loadItems() {
    fetch('get_items.php')
        .then(response => response.json())
        .then(items => {
            console.log(items)
            const table = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
            table.innerHTML = ''; // Clear existing rows

            items.forEach(item => {
                const newRow = table.insertRow();
                const barcodeCell = newRow.insertCell(0);
                const nameCell = newRow.insertCell(1);
                const priceCell = newRow.insertCell(2);
                const displayHomeCell = newRow.insertCell(3);
                const categoryCell = newRow.insertCell(4);
                const quantityCell = newRow.insertCell(5);
                const actionCell = newRow.insertCell(6);

                barcodeCell.textContent = item.barcode;
                nameCell.textContent = item.name;
                priceCell.textContent = item.price;
                displayHomeCell.textContent = item.display_home == 1 ? 'نعم' : 'لا';
                categoryCell.textContent = item.category_name;
                quantityCell.textContent = item.quantity;

                // Set background and text color based on quantity
                if (item.quantity < 0) {
                    newRow.style.backgroundColor = 'red';
                    newRow.style.color = 'white';
                } else if (item.quantity == 0) {
                    newRow.style.backgroundColor = 'yellow';
                    newRow.style.color = 'blue';
                } else {
                    newRow.style.backgroundColor = 'white';
                    newRow.style.color = 'black';
                }

                actionCell.innerHTML = `
                    <button class="edit-button">تعديل</button>
                    <button class="delete-button">حذف</button>
                `;

                newRow.querySelector('.edit-button').addEventListener('click', () => editItem(newRow, item.id, item.barcode, item.name, item.price, item.display_home, item.category_name, item.quantity));
                newRow.querySelector('.delete-button').addEventListener('click', () => deleteItem(item.id));
            });
        })
        .catch(error => console.error('خطأ في تحميل العناصر:', error));
}


// Event listener for form submission
document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    addItem(event);
});

// Load items and categories when the page loads
window.onload = function() {
    loadItems();
    loadCategories(); // Load categories for the add item form
};

