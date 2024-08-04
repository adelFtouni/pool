let currentOpenTableId = null;
let counter = 1; // Counter for table rows
// document.getElementById('closeAllTablesButton').addEventListener('click', handleCloseAllTablesClick);

async function handleCloseAllTablesClick() {
    try {
        const response = await fetch('./closeAllTables.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('All tables closed:', data);

        // Clear the UI for all tables
        const allTables = document.querySelectorAll('.table');
        allTables.forEach(table => {
            table.classList.remove('selected', 'disabled');
            table.addEventListener('click', handleClick);
        });

        clearTable(); // Clear the table content

        const thirdQuarter = document.getElementById('thirdQuarter');
        thirdQuarter.textContent = ''; // Clear the third quarter section

    } catch (error) {
        console.error('Error closing all tables:', error);
    }
}

function clearTable() {
    const itemsTableBody = document.getElementById('itemsTableBody');
    itemsTableBody.innerHTML = ''; // Clear all rows
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.setAttribute('disabled', 'disabled'); // Disable search input initially

    // Fetch tables and invoices on page load
    fetchTables();

    async function fetchTables() {
        try {
            const response = await fetch('fetchTables.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const tablesData = await response.json();
            const tablesWithInvoices = await fetchTablesInvoices(); // Fetch tables with invoices
            displayTables(tablesData, tablesWithInvoices); // Pass tables and tables with invoices data to displayTables
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    }

    async function fetchTablesInvoices() {
        try {
            const response = await fetch('fetchTablesInvoices.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const tableIdsWithInvoices = await response.json(); // Receive an array of table IDs directly

            console.log('Table IDs with invoices:', tableIdsWithInvoices); // Log extracted table IDs

            return tableIdsWithInvoices;
        } catch (error) {
            console.error('Error fetching tables invoices:', error);
            return [];
        }
    }

    async function displayTables(tables, tablesWithInvoices) {
        const tablesContainer = document.getElementById('tables-container');
        try {
            tablesContainer.innerHTML = ''; // Clear previous content

            tables.forEach(table => {
                const tableDiv = document.createElement('div');
                tableDiv.classList.add('table');
                tableDiv.dataset.tableId = table.tableId;
                tableDiv.textContent = `${table.tableId}`;

                if (table.status === 'occupied') {
                    tableDiv.classList.add('occupied');
                }

                // Check if the current table has an associated invoice
                if (tablesWithInvoices.includes(table.tableId.toString())) {
                    tableDiv.classList.add('has_invoice'); // Apply yellow background to tables with invoices
                }

                tableDiv.addEventListener('click', () => {
                    if (!currentOpenTableId) {
                        openTable(table.tableId);
                    }
                });

                tablesContainer.appendChild(tableDiv);
            });
        } catch (error) {
            console.error('Error displaying tables:', error);
        }
    }

    async function openTable(tableId) {
        const thirdQuarter = document.getElementById('thirdQuarter');
        try {
            // Enable search input
            const searchInput = document.getElementById('searchInput');
            searchInput.removeAttribute('disabled'); // Remove disabled attribute to enable
    
            const allTables = document.querySelectorAll('.table');
            allTables.forEach(table => {
                if (table.dataset.tableId !== tableId) {
                    table.removeEventListener('click', handleClick);
                    table.classList.add('disabled');
                }
            });
    
            const clickedTable = document.querySelector(`.table[data-table-id="${tableId}"]`);
            clickedTable.classList.add('selected');
    
            thirdQuarter.textContent = `Table ${tableId}`;
    
            currentOpenTableId = tableId;
    
            const tableNumber = document.createElement('h2');
            tableNumber.textContent = `Table ${tableId}`;
    
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close Table';
            closeButton.classList.add('close-button');
            closeButton.addEventListener('click', () => handleCloseButtonClick(allTables, closeButton));
    
            thirdQuarter.innerHTML = '';
            thirdQuarter.appendChild(tableNumber);
            thirdQuarter.appendChild(document.createElement('br'));
            thirdQuarter.appendChild(closeButton);
    
            // Update table status to occupied in the database
            await updateTableIsOpen(tableId, 'opened');
    
            // Fetch items associated with the table
            const tableItems = await fetchTableItems(tableId);
            if (tableItems.length > 0) {
                console.log('Items in table:', tableItems);
    
                const itemsDetailsPromises = tableItems.map(tableItem => fetchItemDetails(tableItem.i_id));
                const itemsDetails = await Promise.all(itemsDetailsPromises);
    
                // Add quantity to each item detail
                const itemsWithQuantity = itemsDetails.map((itemDetails, index) => ({
                    ...itemDetails,
                    quantity: tableItems[index].i_quantity
                }));
    
                // Populate the table with item details
                populateTable(itemsWithQuantity);
            } else {
                console.log('No items found in table:', tableId);
            }
        } catch (error) {
            console.error('Error handling table click:', error);
        }
    }
    
    function clearTable() {
        const itemsTableBody = document.getElementById('itemsTableBody');
        itemsTableBody.innerHTML = ''; // Clear all rows
    }
    
    function populateTable(items) {
        const itemsTableBody = document.getElementById('itemsTableBody');
        itemsTableBody.innerHTML = ''; // Clear existing rows
    
        items.forEach((item, index) => {
            const newRow = document.createElement('tr');
    
            const total = (item.price * item.quantity).toFixed(2);
    
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.barcode}</td>
                <td><input type="number" value="${item.quantity}" min="1" onchange="updateTotal(this, ${item.price}, '${item.barcode}')"></td>
                <td>${item.price.toFixed(2)}</td>
                <td>${total}</td>
                <td><button onclick="removeItem(this)">Remove</button></td>
            `;
            itemsTableBody.appendChild(newRow);
        });
    }
    
    async function updateTableStatus(tableId, status) {
        try {
            const response = await fetch('./updateTableStatus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableId: tableId    
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Table status updated:', data);
        } catch (error) {
            console.error('Error updating table status:', error);
        }
    }
    async function updateTableIsOpen(tableId, isOpen) {
        try {
            const response = await fetch('./updateTableIsOpen.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableId: tableId,
                    isOpen: isOpen.toString() // Ensure isOpen is sent as a string
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Table status updated:', data);
        } catch (error) {
            console.error('Error updating table status:', error);
        }
    }
    async function fetchTableItems(tableId) {
        try {
            const response = await fetch(`./fetchTableItems.php?tableId=${tableId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const tableItems = await response.json();
            console.log('Fetched table items:', tableItems);
            return tableItems; // Return the fetched table items array
        } catch (error) {
            console.error('Error fetching table items:', error);
            return []; // Return an empty array in case of error
        }
    }
    

    async function fetchItemDetails(itemId) {
        console.log(itemId)
        try {
            const response = await fetch(`./fetchItemDetails.php?itemId=${itemId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const itemDetails = await response.json();
            return itemDetails;
        } catch (error) {
            console.error('Error fetching item details:', error);
            return null;
        }
    }

    function handleCloseButtonClick(allTables, closeButton) {
        allTables.forEach(table => {
            table.addEventListener('click', handleClick);
            table.classList.remove('disabled');
        });
    
        const clickedTable = document.querySelector('.table.selected');
        if (clickedTable) {
            clickedTable.classList.remove('selected');
        }
    
        clearTable(); // Clear the table content when closing
    
        closeButton.remove(); // Remove the close button
        document.getElementById('thirdQuarter').textContent = ''; 
        console.log(tableId)
         updateTableIsOpen(currentOpenTableId, 'closed');
         currentOpenTableId=null;// Clear the third quarter section
         const searchInput = document.getElementById('searchInput');
         searchInput.setAttribute('disabled', 'disabled'); // Disable search input initially
    }
    

    function handleClick(event) {
        const tableId = event.currentTarget.dataset.tableId;

        // Check if there is already an open table
        if (currentOpenTableId) {
            console.log(`Table ${tableId} cannot be opened because Table ${currentOpenTableId} is already open.`);
            return;
        }

        // Open the table if no other table is currently open
        openTable(tableId);
    }

    searchInput.addEventListener('input', searchItems);
})

function searchItems() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput.length === 0) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }

    const encodedSearch = encodeURIComponent(searchInput);

    fetch(`./search.php?search=${encodedSearch}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const searchResultsDiv = document.getElementById('searchResults');
            searchResultsDiv.innerHTML = '';

            if (data.length > 0) {
                let selectedItemIndex = -1; // Track selected item index

                data.forEach((item, index) => {
                    const resultDiv = document.createElement('div');
                    resultDiv.textContent = `${item.id} - ${item.name} - ${item.price} L.B.P`;
                    resultDiv.style.cursor = 'pointer';
                    resultDiv.classList.add('search-result-item'); // Add class for styling
                    resultDiv.addEventListener('click', () => {
                        addItemToDatabase(currentOpenTableId, item.id, 1);
                        document.getElementById('searchResults').style.display = 'none';
                        selectedItemIndex = -1; // Reset selected item index after adding
                    });
                    resultDiv.addEventListener('mouseenter', () => {
                        selectedItemIndex = index;
                        highlightSelectedItem(selectedItemIndex);
                    });
                    searchResultsDiv.appendChild(resultDiv);
                });

                function highlightSelectedItem(index) {
                    const items = searchResultsDiv.querySelectorAll('.search-result-item');
                    items.forEach((item, idx) => {
                        if (idx === index) {
                            item.classList.add('selected');
                        } else {
                            item.classList.remove('selected');
                        }
                    });
                }
            } else {
                searchResultsDiv.textContent = 'No items found matching your search.';
            }
        })
        .catch(error => console.error('Error fetching items:', error));

    document.getElementById('searchResults').style.display = 'block';
}

document.getElementById('searchInput').addEventListener('input', searchItems);
document.getElementById('searchInput').addEventListener('keyup', handleBarcode);

function addItemToDatabase(tableId, itemId, quantity) {
    console.log('Starting addItemToDatabase with', tableId, itemId, quantity);

    fetch('./checkItemInTable.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableId: tableId,
            itemId: itemId,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('checkItemInTable response:', data);
        if (data.exists) {
            const newQuantity = data.quantity + 1;
            updateItemQuantity(tableId, itemId, newQuantity);
        } else {
            addNewItemToTable(tableId, itemId, quantity);
        }
    })
    .catch(error => {
        console.error('Error checking item in table:', error);
    });
}

function addNewItemToTable(tableId, itemId, quantity) {
    console.log('Starting addNewItemToTable with', tableId, itemId, quantity);

    fetch('./addItemToTable.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableId: tableId,
            itemId: itemId,
            itemQuantity: quantity,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('addItemToTable response:', data);
        if (data.success) {
            console.log('New item added to table successfully');
        } else {
            console.error('Failed to add new item to table:', data.message);
        }
    })
    .catch(error => {
        console.error('Error adding new item to table:', error);
    });
}

function updateItemQuantity(tableId, itemId, newQuantity) {
    console.log('Starting updateItemQuantity with', tableId, itemId, newQuantity);

    fetch('./updateItemInTable.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableId: tableId,
            itemId: itemId,
            itemQuantity: newQuantity,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('updateItemInTable response:', data);
        if (data.success) {
            console.log('Item quantity updated successfully');
        } else {
            console.error('Failed to update item quantity:', data.message);
        }
    })
    .catch(error => {
        console.error('Error updating item quantity:', error);
    });
}

function handleBarcode(event) {
    const searchInput = event.target.value.trim();
    if (/^[0-9a-zA-Z]+$/.test(searchInput)) {
        fetch(`./search.php?barcode=${searchInput}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const item = data[0];
                    console.log(item);
                    addItemToDatabase(currentOpenTableId, item.id, 1);
                    document.getElementById('searchResults').style.display = 'none';
                    document.getElementById('searchInput').value = '';
                } else {
                    console.log('No item found with the entered barcode.');
                }
            })
            .catch(error => console.error('Error fetching item by barcode:', error));
    }
}

function addItemToTable(item) {
    console.log(item);
    const itemsTableBody = document.getElementById('itemsTableBody');
    const rows = itemsTableBody.querySelectorAll('tr');
    let itemExists = false;

    rows.forEach(row => {
        if (row.cells[2].textContent === item.barcode || row.cells[1].textContent === item.name) {
            const quantityCell = row.cells[3].querySelector('input[type="number"]');
            let quantity = parseInt(quantityCell.value, 10);
            quantity += 1;
            quantityCell.value = quantity;

            const price = parseFloat(item.price);
            const totalCell = row.cells[5];
            const newTotal = (quantity * price).toFixed(2);
            totalCell.textContent = newTotal;

            itemExists = true;

            // Update the database with the new quantity
            updateItemQuantity(currentOpenTableId, item.id, quantity);
        }
    });

    if (!itemExists) {
        // Add new row in the UI
        const newRow = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = item.id;
        newRow.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        newRow.appendChild(nameCell);

        const barcodeCell = document.createElement('td');
        barcodeCell.textContent = item.barcode;
        newRow.appendChild(barcodeCell);

        const quantityCell = document.createElement('td');
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityCell.appendChild(quantityInput);
        newRow.appendChild(quantityCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = item.price;
        newRow.appendChild(priceCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = item.price;
        newRow.appendChild(totalCell);

        itemsTableBody.appendChild(newRow);

        // Add the new item to the database
        addNewItemToTable(currentOpenTableId, item.id, 1);
    }

    document.getElementById('searchInput').value = '';
}
