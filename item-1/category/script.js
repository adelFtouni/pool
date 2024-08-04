document.getElementById('itemForm').addEventListener('submit', addCategory);

function addCategory(event) {
    event.preventDefault();

    const category = document.getElementById('category').value;

    if (category) {
        const data = { category: category };

        fetch('addCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNotification('تمت إضافة الفئة بنجاح', true);
                loadItems();
                document.getElementById('itemForm').reset();
            } else {
                displayNotification(data.message || 'فشل في إضافة الفئة', false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('الفئة بنفس الاسم موجودة بالفعل', false);
        });
    } else {
        alert('يرجى إدخال فئة صالحة.');
    }
}

// Function to edit a category
function editCategory(row, id, name) {
    row.classList.add('edit-mode');

    const nameCell = row.cells[0];
    const actionCell = row.cells[1];

    nameCell.innerHTML = `<input type="text" value="${name}" class="edit-name">`;

    actionCell.innerHTML = `
        <button class="save-button">حفظ</button>
        <button class="cancel-button">إلغاء</button>
    `;

    actionCell.querySelector('.save-button').addEventListener('click', () => saveCategory(row, id));
    actionCell.querySelector('.cancel-button').addEventListener('click', () => cancelEdit(row, name));
}

// Function to save a category
function saveCategory(row, id) {
    const name = row.querySelector('.edit-name').value;

    if (name) {
        const data = {
            id: id,
            categoryName: name,
        };

        fetch('updateCategory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNotification('تم تحديث الفئة بنجاح');
                loadItems();
            } else {
                displayNotification(data.message || 'فشل في تحديث الفئة', false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('فشل في تحديث الفئة', false);
        });
    } else {
        console.log('يرجى إدخال تفاصيل صالحة.');
    }
}

// Function to cancel edit
function cancelEdit(row, name) {
    row.classList.remove('edit-mode');
    row.cells[0].textContent = name;
    row.cells[1].innerHTML = `
        <button class="edit-button">تعديل</button>
    `;

    row.querySelector('.edit-button').addEventListener('click', () => editCategory(row, row.dataset.id, name));
}

function displayNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isSuccess ? 'darkblue' : 'red';
    document.getElementById('notifications').appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadItems() {
    fetch('getCategory.php')
        .then(response => response.json())
        .then(categories => {
            const table = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
            table.innerHTML = '';

            categories.forEach(category => {
                const newRow = table.insertRow();
                newRow.dataset.id = category.id;
                const nameCell = newRow.insertCell(0);
                const actionCell = newRow.insertCell(1);

                nameCell.textContent = category.name;

                actionCell.innerHTML = `
                    <button class="edit-button">تعديل</button>
                `;

                newRow.querySelector('.edit-button').addEventListener('click', () => editCategory(newRow, category.id, category.name));
            });
        })
        .catch(error => console.error('Error loading items:', error));
}

window.onload = function() {
    loadItems();
};

