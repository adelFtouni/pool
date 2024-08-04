let currentOpenTableId = null;
let counter = 1; // Counter for table rows
let invoiceToAdd = {};
let currentOpenInvoice = null ; 
// document.getElementById('closeAllTablesButton').addEventListener('click', handleCloseAllTablesClick);
//reserve table
function updateTableStatuss() {
    fetch('./updateTableStatus.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableId: currentOpenTableId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Table status updated successfully:', data);
            // Optionally update the UI to reflect the new status
        } else {
            console.error('Failed to update table status:', data.message);
            // Optionally handle error on UI
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error.message);
        // Handle network or fetch errors gracefully
    });
}
function updateTableIsNotReserved() {
    fetch('./updateTableIsNotReserved.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableId: currentOpenTableId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Table status updated successfully:', data);
            // Optionally update the UI to reflect the new status
        } else {
            console.error('Failed to update table status:', data.message);
            // Optionally handle error on UI
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error.message);
        // Handle network or fetch errors gracefully
    });
}
function updateTotal(quantityInput, price, barcode) {
    const quantity = parseInt(quantityInput.value, 10);
    const row = quantityInput.closest('tr');
    const totalCell = row.children[5];
    const total = (quantity * price).toFixed(2);
    totalCell.textContent = total;

    // Update quantity and total in local storage
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const index = items.findIndex(item => item.barcode === barcode);
    if (index !== -1) {
        items[index].quantity = quantity;
        items[index].total = parseFloat(total);
        localStorage.setItem('items', JSON.stringify(items));
    }
}
function handleKeyPress(event, id, price, barcode, currentQty) {
    if (event.key === 'Enter') {
        const inputElement = event.target;
        console.log(inputElement)
        const newQty = parseInt(inputElement.value, 10);

        console.log(id);
        console.log(newQty);

        fetch('./updateQuantityById.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tableId:currentOpenTableId,
                itemId: id,
                itemQuantity: newQty
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Item quantity updated successfully:', data);
                populateTable();
                // Optionally update UI or perform additional actions on success
            } else {
                console.error('Failed to update item quantity:', data.message);
                // Optionally handle error on UI
            }

            // Check if there's a message indicating database update failure
            if (data.message && data.message.startsWith('Failed to update')) {
                console.error('Database update failed:', data.message);
                // Optionally handle this case (e.g., notify user, retry logic)
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error.message);
            // Handle network or fetch errors gracefully
        });
    }
}


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
})
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
    
                const saveInvoice = document.createElement('button');
                saveInvoice.textContent = 'save invoice';
            saveInvoice.classList.add('save-invoice');
            saveInvoice.addEventListener('click', () => populateInvoice(currentOpenTableId));
            thirdQuarter.appendChild(saveInvoice)
            // Update table status to occupied in the database
            await updateTableIsOpen(tableId, 'opened');
    
            // Fetch items associated with the table
           populateTable();
        } catch (error) {
            console.error('Error handling table click:', error);
        }
    }
    
    function clearTable() {
        const itemsTableBody = document.getElementById('itemsTableBody');
        itemsTableBody.innerHTML = ''; // Clear all rows
    }
    async function populateTable() {
        const tableItems = await fetchTableItems(currentOpenTableId);
        if (tableItems.length > 0) {
            console.log('Items in table:', tableItems);
    
            const itemsDetailsPromises = tableItems.map(tableItem => fetchItemDetails(tableItem.i_id));
            const itemsDetails = await Promise.all(itemsDetailsPromises);
    
            // Add quantity to each item detail
            const itemsWithQuantity = itemsDetails.map((itemDetails, index) => ({
                ...itemDetails,
                quantity: tableItems[index].i_quantity
            }));
    
            const itemsTableBody = document.getElementById('itemsTableBody');
            itemsTableBody.innerHTML = ''; // Clear existing rows
            console.log(itemsWithQuantity);
    
            itemsWithQuantity.forEach((item, index) => {
                const newRow = document.createElement('tr');
    
                const total = (item.price * item.quantity).toFixed(2);
    
                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.barcode}</td>
                    <td><input type="number" value="${item.quantity}" min="1" onkeypress="handleKeyPress(event, ${item.id}, ${item.price}, '${item.barcode}', this.value)"></td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${total}</td>
                    <td><button onclick="removeItem(${item.id}, this)">Remove</button></td>
                `;
                itemsTableBody.appendChild(newRow);
            });
        } else {
            console.log('No items found in table:', tableId);
        }
    }
    async function sendInvoiceToServer(invoiceToAdd) {
        try {
            const response = await fetch('./addInvoideToServer.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceToAdd)
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log('Invoice added successfully:', result);
                 updateTableIsOpen(currentOpenTableId, 'closed');   
                await updateTableIsNotReserved()
            } else {
                console.error('Failed to add invoice:', result.message);
            }
        } catch (error) {
            console.error('Error sending invoice to server:', error);
        }
    }
    
    async function populateInvoice() {
        try {
            const tableItems = await fetchTableItems(currentOpenTableId);
            if (tableItems.length > 0) {
                console.log('Items in table:', tableItems);
    
                const itemsDetailsPromises = tableItems.map(tableItem => fetchItemDetails(tableItem.i_id));
                const itemsDetails = await Promise.all(itemsDetailsPromises);
    
                // Add quantity and totalPrice to each item detail
                const itemsWithQuantity = itemsDetails.map((itemDetails, index) => ({
                    ...itemDetails,
                    quantity: tableItems[index].i_quantity,
                    totalPrice: tableItems[index].i_quantity * itemDetails.price // assuming price is a property in itemDetails
                }));
    
                const invoiceToAdd = {
                    tableId: currentOpenTableId,
                    items: itemsWithQuantity
                };
    
                console.log(invoiceToAdd);
    
                // Send the invoice to the server
                const response = await fetch('./addInvoideToServer.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(invoiceToAdd)
                });
    
                const result = await response.json();
                if (result.success) {
                    console.log('Invoice processing succeeded:', result.messages);
                } else {
                    console.error('Invoice processing failed:', result.message);
                }
            } else {
                console.log('No items found in invoice:', currentOpenTableId);
            }
        } catch (error) {
            console.error('Error populating invoice:', error);
        }
    }
    
    
    
    




    function removeItem(itemId, buttonElement) {
        fetch('./deleteItemById.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId: itemId ,tableId:currentOpenTableId})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Item deleted successfully:', data);
                // Remove the row from the table
                const row = buttonElement.closest('tr');
                row.parentNode.removeChild(row);
            } else {
                console.error('Failed to delete item:', data.message);
                // Optionally handle error on UI
            }
    
            // Check if there's a message indicating database deletion failure
            if (data.message && data.message.startsWith('Failed to delete')) {
                console.error('Database deletion failed:', data.message);
                // Optionally handle this case (e.g., notify user, retry logic)
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error.message);
            // Handle network or fetch errors gracefully
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


function searchItems() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput.length === 0) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }

    const encodedSearch = encodeURIComponent(searchInput);
    const isBarcode = /^[0-9a-zA-Z]+$/.test(searchInput);

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
                searchResultsDiv.textContent = isBarcode
                    ? 'No item found with that barcode.'
                    : 'No items found matching your search.';
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
            populateTable();
            updateTableStatuss()
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
            populateTable();
        } else {
            console.error('Failed to update item quantity:', data.message);
        }
    })
    .catch(error => {
        console.error('Error updating item quantity:', error);
    });
}

// function handleBarcode(event) {
//     const searchInput = event.target.value.trim();
//     if (/^[0-9a-zA-Z]+$/.test(searchInput)) {
//         fetch(`./search.php?barcode=${searchInput}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (data && data.length > 0) {
//                     console.log(data);
//                     addItemToTable(data[0]);
//                     document.getElementById('searchResults').style.display = 'none';
//                 } else {
//                     console.log('No item found with the entered barcode.');
//                 }
//             })
//             .catch(error => console.error('Error fetching item by barcode:', error));
//     }
// }


let timeoutId = null;

function handleBarcode(event) {
  const searchInput = event.target.value.trim();
  if (/^[0-9a-zA-Z]+$/.test(searchInput)) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fetch(`./search.php?barcode=${searchInput}`)
       .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
       .then(data => {
          if (data && data.length > 0) {
            console.log(data);
            addItemToTable(data[0]);
            document.getElementById('searchResults').style.display = 'none';
          } else {
            console.log('No item found with the entered barcode.');
          }
        })
       .catch(error => console.error('Error fetching item by barcode:', error));
    }, 500); // adjust the timeout value as needed
  }
}

function addItemToTable(item) {
    console.log(item)
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
        addItemToDatabase(currentOpenTableId, item.id, 1);
    }

    document.getElementById('searchInput').value = '';
}
