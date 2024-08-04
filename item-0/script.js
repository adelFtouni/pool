// Function to edit an item
function editItem(row, id, barcode, name, price, displayHome) {
    row.classList.add('edit-mode');

    const barcodeCell = row.cells[0];
    const nameCell = row.cells[1];
    const priceCell = row.cells[2];
    const displayHomeCell = row.cells[3];
    const actionCell = row.cells[4];

    console.log("Editing item with displayHome:", displayHome);

    barcodeCell.innerHTML = `<input type="text" value="${barcode}" class="edit-barcode">`;
    nameCell.innerHTML = `<input type="text" value="${name}" class="edit-name">`;
    priceCell.innerHTML = `<input type="text" value="${price}" class="edit-price">`;
    displayHomeCell.innerHTML = `<input type="checkbox" class="edit-displayHome" ${displayHome == "Yes" ? 'checked' : ''}>`;

    actionCell.innerHTML = `
        <button class="save-button">Save</button>
        <button class="cancel-button">Cancel</button>
    `;

    actionCell.querySelector('.save-button').addEventListener('click', () => saveItem(row, id));
    actionCell.querySelector('.cancel-button').addEventListener('click', () => cancelEdit(row, barcode, name, price, displayHome));
}

// Function to save an item
function saveItem(row, id) {
    const barcode = row.querySelector('.edit-barcode').value;
    const name = row.querySelector('.edit-name').value;
    const price = row.querySelector('.edit-price').value;
    const displayHome = row.querySelector('.edit-displayHome').checked ? 1 : 0;

    if (barcode && name && price && !isNaN(price)) {
        const data = {
            id: id,
            itemBarcode: barcode,
            itemName: name,
            itemPrice: price,
            displayHome: displayHome
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
                displayNotification('Item updated successfully');
                loadItems();
            } else {
                displayNotification(data.message || 'Failed to update item', false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('Failed to update item', false);
        });
    } else {
        console.log('Please enter valid details.');
    }
}

// Function to cancel edit
function cancelEdit(row, barcode, name, price, displayHome) {
    row.classList.remove('edit-mode');
    row.cells[0].textContent = barcode;
    row.cells[1].textContent = name;
    row.cells[2].textContent = price;
    row.cells[3].textContent = displayHome == 1 ? 'Yes' : 'No';
    row.cells[4].innerHTML = `
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `;

    row.querySelector('.edit-button').addEventListener('click', () => editItem(row, id, barcode, name, price, displayHome));
    row.querySelector('.delete-button').addEventListener('click', () => deleteItem(id));
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
            displayNotification('Item deleted successfully', true);
            loadItems();
        } else {
            displayNotification(data.message || 'Failed to delete item', false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayNotification('Failed to delete item', false);
    });
}

function addItem(event) {
    event.preventDefault();

    const barcode = document.getElementById('barcode').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const displayHome = document.getElementById('displayHome').checked ? 1 : 0;
console.log(barcode)
    if (barcode && name && price && !isNaN(price)) {
        const data = {
            itemBarcode: barcode,
            itemName: name,
            itemPrice: price,
            displayHome: displayHome
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
                console.log(data.success)
                displayNotification('Item added successfully', true);
                loadItems();
                document.getElementById('itemForm').reset();
            } else {
                
                displayNotification(data.message || 'Failed to add item', false);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('Item with the same barcode or name already exists', false);
        });
    } else {
        alert('Please enter valid details.');
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
            const table = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
            table.innerHTML = ''; // Clear existing rows

            items.forEach(item => {
                const newRow = table.insertRow();
                const barcodeCell = newRow.insertCell(0);
                const nameCell = newRow.insertCell(1);
                const priceCell = newRow.insertCell(2);
                const displayHomeCell = newRow.insertCell(3);
                const actionCell = newRow.insertCell(4);

                barcodeCell.textContent = item.barcode;
                nameCell.textContent = item.name;
                priceCell.textContent = item.price;
                displayHomeCell.textContent = item.display_home;

                actionCell.innerHTML = `
                    <button class="edit-button">تعديل</button>
                    <button class="delete-button">حذف</button>
                `;

                newRow.querySelector('.edit-button').addEventListener('click', () => editItem(newRow, item.id, item.barcode, item.name, item.price, item.display_home));
                newRow.querySelector('.delete-button').addEventListener('click', () => deleteItem(item.id));
            });
        })
        .catch(error => console.error('Error loading items:', error));
}

// Event listener for form submission
document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const submitButton = document.querySelector('input[type="submit"]');
    if (submitButton.value === 'Add Item') {
        addItem(event);
    }
});

// Load items when the page loads
window.onload = function() {
    loadItems();
};

