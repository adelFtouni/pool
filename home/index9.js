let currentOpenTableId = null;
let counter = 1; // Counter for table rows
let invoiceToAdd = {};
let currentOpenInvoice = null ; 
let tableData = [];
let printButton = document.getElementById('printButton');
let rate;
const modal = document.getElementById('invoiceModal');
        modal.style.display = 'none';
let day = 0;
let dayStatus;
let canSell ;
let idQauntityAllowedQuantity = [];
let idAndCreatedAt={};
let rowDate=null;
let cName = '';
// document.getElementById('closeAllTablesButton').addEventListener('click', handleCloseAllTablesClick);
//reserve table


function setTableToInvoice(tableId, invoiceId) {
    fetch('./setTableToInvvoice.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableId: tableId, invoiceId: invoiceId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Success:', data.message);
            console.log('Executed Query:', data.query);
            console.log('tableId',data.tableId);
            console.log('invoiceId',data.invoiceId)
            if(tableId ==46){
                window.location.reload();
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


async function createInvoice(cName) {
    try {
        // Perform any necessary actions, like updating UI
        // tableContent();

        // Make the fetch request to createInvoice.php
        const response = await fetch('./createInvoice.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dayId: day,cName:cName }) // Send dayId as JSON in the request body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            console.log('Invoice created successfully');
            console.log('Invoice ID:', data.invoiceId);

            // Assuming setTableToInvoice function sets some UI or application state
            setTableToInvoice(currentOpenTableId, data.invoiceId);
        } else {
            console.error('Error creating invoice:', data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

``



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
async function handleKeyPress(event, id, table_item_id, barcode, currentQty) {
    console.log(id);
    console.log(table_item_id)
    if (event.key === 'Enter') {
        const inputElement = event.target;
        const newQty = parseInt(inputElement.value, 10);

        fetch('./updateQuantityById.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tableId: currentOpenTableId,
                itemId: id,
                itemQuantity: newQty,
                table_item_id:table_item_id
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async (data) => {
            if (data.success) {
                console.log('Item quantity updated successfully:', data);
await checkQuantities();
await populateTable();
                // // Log status message based on server response
                // if (data.status.status === 'good') {
                //     console.log('Item quantity updated successfully: Quantity is greater than 0');
                //     const rows = document.querySelectorAll('#itemsTableBody tr');
                //     rows.forEach(row => {
                //         const itemIdAttr = row.getAttribute('data-item-id');
                //         console.log(itemIdAttr);
                //         console.log(id) // Get data-item-id attribute value
                //         if (itemIdAttr === id.toString()) {
                //             row.style.backgroundColor = 'white';
                //             row.style.color = 'black'; // Set background color directly
                //         }
                //     });
                // } else if (data.status.status === 'no_more_stock') {
                //     console.log('Item quantity updated successfully: No more stock available');
                //     const rows = document.querySelectorAll('#itemsTableBody tr');
                //     rows.forEach(row => {
                //         const itemIdAttr = row.getAttribute('data-item-id');
                //         console.log(itemIdAttr);
                //         console.log(id) // Get data-item-id attribute value
                //         if (itemIdAttr === id.toString()) {
                //             row.style.backgroundColor = 'yellow';
                //             row.style.color = 'blue'; // Set background color directly
                //         }
                //     });
                // } else if (data.status.status === 'need_to_check') {
                //     console.log('Item quantity updated successfully: Quantity is negative, needs checking');
                //     const rows = document.querySelectorAll('#itemsTableBody tr');
                //     rows.forEach(row => {
                //         const itemIdAttr = row.getAttribute('data-item-id');
                //         console.log(itemIdAttr);
                //         console.log(id) // Get data-item-id attribute value
                //         if (itemIdAttr === id.toString()) {
                //             row.style.backgroundColor = 'red';
                //             row.style.color = 'white'; // Set background color directly
                //         }
                //     });
                // }

                // Optionally update UI or perform additional actions on success
                //  populateTable(id); // Uncomment if needed
            } else {
                console.error('Failed to update item quantity:', data.message);

                // Log error message from server
                if (data.message) {
                    console.error('Failed to update item quantity: ' + data.message);
                }
            }
        })
        .catch(error => {
            console.error('Error during fetch:', error.message);
            // Handle network or fetch errors gracefully
        });
    }
}





// Function to update UI of the table row corresponding to the item ID
async function updateTableRowUi(id) {
    console.log(id);
    const rows = document.querySelectorAll('#itemsTableBody tr');
    rows.forEach(row => {
        const itemIdCell = row.cells[0]; // Assuming ID is in the first cell
        if (itemIdCell.textContent.trim() === id.toString()) {
            row.classList.add('red-bg'); // Add a class to mark the row as red
        }
    });
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
async function createNewDay() {
    try {
        // Make a POST request to insert a new day
        const insertResponse = await fetch('../sales/newDay.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rate: rate
            })
        });

        if (!insertResponse.ok) {
            throw new Error('Failed to insert new day');
        }

        const insertData = await insertResponse.json();

        if (insertData.insert_success) {
            console.log('New day added successfully');
            console.log('New day ID:', insertData.new_day_id);
        } else {
            console.error('Error inserting new day:', insertData.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    handleCloseAllTablesClick();
    currentOpenTableId = null;
    await fetchTableStatuses();
const customerName = document.getElementById('customerName');
customerName.setAttribute('disabled','true');
    await allowedQuantity();
    await fetchItems();
    // disableItemBoxes();
    console.log(idQauntityAllowedQuantity);
    console.log('here')
    await currentDay();
   
    await fetchDollarValue();
    
    if (dayStatus === 'done' || dayStatus === undefined ) {
        // Create a message element
        const messageElement = document.createElement('div');
        messageElement.style.backgroundColor = 'red';
        messageElement.style.color = 'white';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.padding = '20px';
        messageElement.textContent = 'Open new day to start selling';
        document.body.appendChild(messageElement);
    
        // Create "Create new day" button
        const createNewDayButton = document.createElement('button');
        createNewDayButton.style.backgroundColor = 'green';
        createNewDayButton.style.padding = '10px 20px';
        createNewDayButton.style.color = 'white';
        createNewDayButton.textContent = 'Create new day';
        createNewDayButton.addEventListener('click', async () => {
            await createNewDay(); // Call your createNewDay function
            location.reload(); // Refresh the page after creating new day
        });
        document.body.appendChild(createNewDayButton);
    
        // Set the variable canSell to false
        canSell = false;
    } else {
        // Set the variable canSell to true if dayStatus is not 'done'
        canSell = true;
    }
     await fetchTables();
      
     await fetchTableStatuses();
//    currentDay();
    fetchDay();
    fetchDollarValue();
    printButton.setAttribute('disabled', 'true');
    const searchInput = document.getElementById('searchInput');
    searchInput.setAttribute('disabled', 'disabled'); // Disable search input initially

    // Fetch tables and invoices on page load
    
    
    async function fetchTables() {
        try {
            const response = await fetch('fetchTables.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const tablesData = await response.json();
            console.log(tablesData)
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
    
            tables.forEach((table, index) => {
                const tableDiv = document.createElement('div');
                tableDiv.classList.add('table');
                tableDiv.dataset.tableId = table.tableId;
    
                if (index === tables.length - 1) {
                    // Check if this is the last table in the list
                    tableDiv.textContent = 'بيع بدون طاولة'; // Change text content for the last table
                    tableDiv.classList.add('special-table'); // Apply special CSS class
                } else {
                    tableDiv.textContent = `${table.tableId}`;
                }
    
                if (table.status === 'occupied') {
                    tableDiv.classList.add('occupied');
                }
    
                // Check if the current table has an associated invoice
                // if (tablesWithInvoices.includes(table.tableId.toString())) {
                //     tableDiv.classList.add('has_invoice'); // Apply yellow background to tables with invoices
                // }
    
                if (!canSell) {
                    tableDiv.classList.add('disabled'); // Add a disabled class to visually disable the table div
                    tableDiv.style.pointerEvents = 'none'; // Disable pointer events on the div
                } else {
                    tableDiv.addEventListener('click', async () => {
                        if (!currentOpenTableId) {
                          await   openTable(table.tableId);
                           
                        }
                    });
                }
    
                tablesContainer.appendChild(tableDiv);
            });
        } catch (error) {
            console.error('Error displaying tables:', error);
        }
    }
    
})    
async function openTable(tableId) {
   
   


    console.log('here')
    
    if (tableId == 46) {
        console.log('sell without table');
        // const thirdQuarter = document.getElementById('thirdQuarter');
       
        // Create the button element
        const withoutName = document.createElement('button');
        withoutName.id='wnb';
        withoutName.textContent = 'بدون إسم'; // Button text in Arabic
        withoutName.style.background = 'blue';
        withoutName.style.color = 'white';
        withoutName.style.padding = '5px';
        withoutName.onclick=()=>{
            document.getElementById('customerName').value='بدون إسم';
            document.getElementById('customerName').focus();
        }
        // Get the wnd div by its id
        const wnd = document.getElementById('withoutName');
        
        // Append the button to wnd div
        wnd.appendChild(withoutName);
    }
    
    await fetchItems(tableId);
 
    
    
    console.log(tableId)
     await fetchCustomerName(tableId);
     await fetchTableStatus(tableId);
    
    printButton.setAttribute('disabled', 'true');
    try {
        
    
        // Log the table ID
        console.log(tableId);

        const thirdQuarter = document.getElementById('thirdQuarter');

        // Enable search input
    //    / const searchInput = document.getElementById('customerName');
        // searchInput.removeAttribute('disabled'); // Remove disabled attribute to enable

        // Disable other tables and highlight the clicked table
        const allTables = document.querySelectorAll('.table');
        allTables.forEach(table => {
            if (table.dataset.tableId !== tableId) {
                table.removeEventListener('click', handleClick);
                table.classList.add('disabled');
            }
        });

        const clickedTable = document.querySelector(`.table[data-table-id="${tableId}"]`);
        clickedTable.classList.add('selected');

        // Update thirdQuarter content
        thirdQuarter.textContent = `Table ${tableId}`;

        // Set currentOpenTableId
        currentOpenTableId = tableId;

        // Create table number element
        const tableNumber = document.createElement('h2');
        if(tableId ==46){
            tableNumber.textContent = 'مبيع بدون طاولة'
        }else{
            tableNumber.textContent = `Table ${tableId}`;
        }
        

        const cancelReservation = document.createElement('button');
        cancelReservation.textContent ="إلغاء حجز الطّاولة";
        cancelReservation.style.background = 'red';
        cancelReservation.style.color = 'white';
        // cancelReservation.addEventListener('click',()=>unReserveTable(tableId));
        cancelReservation.onclick=async function(){
            // currentOpenTableId=null;
           
            await unReserveTable(tableId);
            await updateTableIsOpen(currentOpenTableId, 'closed');
            await fetchTableStatuses();
            
            window.location.reload();
        }
        cancelReservation.style.opacity = '0.5';
        cancelReservation.className = 'cancel-reservation-button';
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'إغلاق الطاولة';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => handleCloseButtonClick(allTables, closeButton));

        // Clear thirdQuarter and append elements
        thirdQuarter.innerHTML = '';
        thirdQuarter.appendChild(tableNumber);
        thirdQuarter.appendChild(document.createElement('br'));
        thirdQuarter.appendChild(closeButton);
        thirdQuarter.appendChild(cancelReservation);
        const cancelButton = document.querySelector('.cancel-reservation-button');
        cancelButton.disabled = true;
        // Create save invoice button
        const saveInvoice = document.createElement('button');
        saveInvoice.textContent = 'عرض الفاتورة';
        saveInvoice.classList.add('save-invoice');
        saveInvoice.addEventListener('click', () => tableContent());
        thirdQuarter.appendChild(saveInvoice);

        // Create print table content button
        // const contentButton = document.createElement('button');
        // contentButton.textContent = 'Print Table Content';
        // contentButton.classList.add('print-invoice');
        // contentButton.addEventListener('click', () => tableContent());
        // thirdQuarter.appendChild(contentButton);

        // Update table status to 'opened' in the database
        await updateTableIsOpen(tableId, 'opened');

        // Fetch items associated with the table
        populateTable(tableId);
         fetchTableStatus(tableId);
        const tbody = document.getElementById("itemsTableBody");
    
        // Select all child elements (assuming they are tr elements)
        const elements = tbody.getElementsByTagName("tr");
        
        // Log the length of elements in the console
        console.log("Number of elements in tbody:", elements.length);
        if(elements.length >0){
            const cancelButton = document.querySelector('.cancel-reservation-button');
    cancelButton.disabled = true;
    cancelButton.style.opacity = '0.5';
        }else{
            const cancelButton = document.querySelector('.cancel-reservation-button');
            cancelButton.disabled = false;
            cancelButton.style.opacity = '1';
        }
    } catch (error) {
        console.error('Error handling table click:', error);
    }
    const cancelButton = document.querySelector('.cancel-reservation-button');
    const invoiceElements = document.querySelectorAll('#itemsTableBody tr');
    
    if (invoiceElements.length === 0) {
        cancelButton.disabled = false;
        cancelButton.style.opacity = '1';
    } else {
        cancelButton.disabled = true;
        cancelButton.style.opacity = '0.5';
    }
}

    
    function clearTable() {
        const itemsTableBody = document.getElementById('itemsTableBody');
        itemsTableBody.innerHTML = ''; // Clear all rows
    }
     async function tableContent() {
         await fetchCustomerName(currentOpenTableId);
        console.log(cName)
        const tableBody = document.getElementById('itemsTableBody');
        const rows = tableBody.getElementsByTagName('tr');
        let tableData = [];
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const quantityInput = cells[3].querySelector('input');
            
            const item = {
                counter: cells[0].textContent.trim(),
                itemName: cells[1].textContent.trim(),
                quantity: parseInt(quantityInput.value.trim()),
                price: parseFloat(cells[4].textContent.trim().replace(/,/g, '')),
total: parseFloat(cells[5].textContent.trim().replace(/,/g, '')),
date:cells[6].textContent
            };
            tableData.push(item);
        }
    
        console.log(tableData);
    
        // Clear the modal content
        const invoiceTableBody = document.getElementById('invoiceTableBody');
        invoiceTableBody.innerHTML = ''; // Clear previous content
        
        let totalPrice = 0;
    
        tableData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.counter}</td>
                <td>${item.itemName}</td>
                <td>${item.quantity}</td>
               <td>${item.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>

                <td>${item.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td>${item.date}</td>
            `;
            invoiceTableBody.appendChild(row);
            totalPrice += item.total;
        });
    
        // Set total price
        const totalPriceElement = document.getElementById('totalPrice');
        totalPriceElement.textContent = `السعر الإجمالي ل.ل: ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        
        const totalPriceDollar = document.getElementById('totalPriceDollar');
        totalPriceDollar.textContent = `السعر الإجمالي $$: ${(totalPrice / rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `;
        
        // Add currentOpenTableId to the modal
        const tableInfo = document.getElementById('tableInfo');
        tableInfo.textContent = `رقم الطاولة: ${currentOpenTableId}`;
        // invoiceTableBody.insertAdjacentElement('afterbegin', tableInfo);
        const cNamee = document.getElementById('cName');
        cNamee.textContent =  'إسم الزبون:  '+cName;
        // Show the modal
        const modal = document.getElementById('invoiceModal');
        modal.style.display = 'block';
    
        // Close button functionality
        const closeButton = document.querySelector('.close-button');
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };
    
        // Cancel button functionality
        const cancelButton = document.getElementById('cancelButton');
        cancelButton.onclick = function() {
            modal.style.display = 'none';
            tableData = []; // Clear the tableData array
        };
        const closeBtn = document.getElementById('closeModal')
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            // tableData = []; // Clear the tableData array
        };
        // Enable the print button if tableData is not empty
        const printButton = document.getElementById('printButton');
        if (tableData.length > 0) {
            printButton.removeAttribute('disabled');
        } else {
            printButton.setAttribute('disabled', 'true');
        }
    
        // Print button functionality
        printButton.onclick = async function() {
            try {
                document.getElementById('total').textContent='';
                await unReserveTable(currentOpenTableId);
            
               await  disableItemBoxes();
                await createInvoice(cName);
                document.getElementById('searchInput').value = '';
               
                modal.style.display = 'none';
                await closeTableAfterPrint(currentOpenTableId);
            //    await  fetchTableStatus(currentOpenTableId);
                printModalContent(currentOpenTableId); // Pass currentOpenTableId to printModalContent
               const invoice = document.getElementById('#itemsTableBody');
               invoice.innerHTML='';
               
            } catch (error) {
                console.error('Error during print process:', error);
            }
        };
    
        // Close the modal if the user clicks outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    
        // Optionally return tableData if needed elsewhere
        return tableData;
    }
    
    async function updateTableRowUI(id){
        console.log(id);
        const rows = document.querySelectorAll('#itemsTableBody tr');
        rows.forEach(row => {
            const itemIdCell = row.cells[0]; // Assuming ID is in the first cell
            if (itemIdCell.textContent.trim() === id) {
                row.style.backgroundColor = 'red';
            }
        });
    }
    // Global variable to store id and createdAt date


// Function to populate table with items and display createdAt
async function populateTable(id) {
    console.log(id);
    const itemsTableBody = document.getElementById('itemsTableBody');
    itemsTableBody.innerHTML = ''; // Clear existing rows




    const tableItems = await fetchTableItems(currentOpenTableId);
    if (tableItems.length > 0) {
        ////////////////////
        const cancelButton = document.querySelector('.cancel-reservation-button');
        cancelButton.disabled = true;
        cancelButton.style.opacity = '0.5';
        ///////////////////////
        const itemsDetailsPromises = await tableItems.map(tableItem => fetchItemDetails(tableItem.i_id,tableItem.id));
        const itemsDetails = await Promise.all(itemsDetailsPromises);

        // Assuming idAndCreatedAt is fetched from somewhere, containing { id: table_item_id, date: createdAt }
        const idAndCreatedAt = {id:itemsDetails.id,createdAt:itemsDetails.createdAt};
console.log(idAndCreatedAt)
        // Add quantity and createdAt to each item detail
        const itemsWithQuantityAndCreatedAt = tableItems.map((tableItem, index) => ({
            ...itemsDetails[index],
            quantity: tableItem.i_quantity,
            table_item_id: tableItem.id,
            itemId: tableItem.i_id,
            //  createdAt: (tableItem.id === idAndCreatedAt.id) ? idAndCreatedAt.date : tableItem.createdAt // Display createdAt from global variable
            createdAt : tableItem.createdAt
        }));
console.log(itemsWithQuantityAndCreatedAt)
        let totalPrice = 0; // Initialize total price
        let counter = 1;
        for (let item of itemsWithQuantityAndCreatedAt) {
            console.log(item)
            const newRow = document.createElement('tr');
            const total = (item.price * item.quantity).toLocaleString();
            const totall = item.price * item.quantity; 
            totalPrice += (totall); // Accumulate total price

            // Set table_item_id attribute for each row
            newRow.setAttribute('table_item_id', item.table_item_id);
            newRow.setAttribute('itemId', item.itemId);

            // Populate the row
            newRow.innerHTML = `
                <td>${counter}</td>
                <td>${item.name}</td>
                <td>${item.barcode}</td>
                <td><input type="number" value="${item.quantity}" min="1" onkeypress="handleKeyPress(event, ${item.itemId}, ${item.table_item_id}, '${item.barcode}', ${item.quantity})"></td>
                <td>${item.price.toLocaleString()}</td>
<td>${total.toLocaleString()}</td>

                <td>${item.createdAt}</td> <!-- Display createdAt field -->
                <td><button onclick="removeItem(${item.table_item_id}, ${item.itemId}, ${item.quantity})">Remove</button></td>
                
            `;

            itemsTableBody.appendChild(newRow);
            counter++;

            await checkQuantities(id); // Assuming this function needs to be awaited after each row addition
        }

        // Update total row
        const totalRow = document.getElementById('total');
        if (totalRow) {
            totalRow.textContent = totalPrice.toLocaleString();

        } else {
            console.error('Total row element not found.');
        }
    } else {
        console.log('No items found in table:', currentOpenTableId);
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
    
    
    
    




    function removeItem(table_item_id, itemId, qty) {
        console.log('Removing item with table_item_id:', table_item_id);
    
        fetch('./deleteItemById.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ table_item_id: table_item_id, itemId: itemId, qty: qty, tableId: currentOpenTableId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            if (data.success) {
                console.log('Item deleted successfully:', data);
              
                // Find the row with the specified table_item_id and remove it
                const row = document.querySelector(`tr[table_item_id="${data.deleted_table_item_id}"]`);
                console.log('Deleted table_item_id:', data.deleted_table_item_id);
                console.log('Row:', row);
    
                if (!row) {
                    console.error(`Row with table_item_id ${data.deleted_table_item_id} not found`);
                    return;
                }
    
                // Get the total price from the row
                const sixthCell = row.cells[5]; // Assuming the structure matches
                let totalPrice = 0;
                if (sixthCell) {
                    const totalPriceText = sixthCell.textContent.trim();
                    totalPrice = parseFloat(totalPriceText.replace(/[,\.]/g, '').replace(/\.?00$/, ''));
                }
    
                // Remove the row from the table
                row.parentNode.removeChild(row);
    
                // Update the total if necessary
                const totalElement = document.getElementById('total');
                let currentTotalText = totalElement.textContent.trim();
                let currentTotal = parseFloat(currentTotalText.replace(/[,\.]/g, '').replace(/\.?00$/, ''));
                
                // Check if this was the last item
                const remainingRows = document.querySelectorAll('tr[table_item_id]');
                if (remainingRows.length === 0) {
                    // If no remaining rows, subtract entire total
                    currentTotal = 0;
                } else {
                    // Otherwise, subtract only the deleted item's total price
                    currentTotal -= totalPrice;
                }
    
                totalElement.textContent = currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
                await populateTable();
                const tbody = document.getElementById("itemsTableBody");
    
        // Select all child elements (assuming they are tr elements)
        const elements = tbody.getElementsByTagName("tr");
        
        // Log the length of elements in the console
        console.log("Number of elements in tbody:", elements.length);
        if(elements.length >0){
            const cancelButton = document.querySelector('.cancel-reservation-button');
    cancelButton.disabled = true;
    cancelButton.style.opacity = '0.5';
        }else{
            const cancelButton = document.querySelector('.cancel-reservation-button');
            cancelButton.disabled = false;
            cancelButton.style.opacity = '1';
        }
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
    

    async function fetchItemDetails(itemId, tableItemId) {
        try {
            const response = await fetch(`./fetchItemDetails.php?itemId=${itemId}&table_item_id=${tableItemId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const itemDetails = await response.json();
            console.log(itemDetails.createdAt)
            return itemDetails; // Returns an object with properties: name, price, barcode, i_quantity, createdAt
        } catch (error) {
            console.error('Error fetching item details:', error);
            return null;
        }
    }
    

   async function handleCloseButtonClick(allTables, closeButton) {
    
    // if(cName){
      
    //     var openedTable = document.querySelector('.table[data-table-id="' + currentOpenTableId + '"]');
 
    //     openedTable.style.backgroundColor = 'violet';
    // }else{
    //     var openedTable = document.querySelector('.table[data-table-id="' + currentOpenTableId + '"]');
    //     openedTable.style.backgroundColor = 'darkblue';
    //     openedTable.style.color = 'white';
    // }
    if(currentOpenTableId ==46){
        document.getElementById('wnb').style.display='none';
        window.location.reload();
    }
    const customerName = document.getElementById('customerName');
customerName.setAttribute('disabled','true');
customerName.value = '';
disableItemBoxes();
const cancelButton = document.querySelector('.cancel-reservation-button');
cancelButton.disabled = true;
cancelButton.style.opacity = '0.5';
    const rows = document.querySelectorAll('#itemsTableBody tr');
                    rows.forEach(row => {
                        // const itemIdAttr = row.getAttribute('data-item-id');
                        // console.log(itemIdAttr);
                        // console.log(id) // Get data-item-id attribute value
                        // if (itemIdAttr === id.toString()) {
                            row.style.backgroundColor = 'white';
                            row.style.color = 'black'; // Set background color directly
                        // }
                    });
        const totalRow = document.getElementById('total');
        totalRow.textContent=0;
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
         await fetchTableStatuses();
         const searchInput = document.getElementById('searchInput');
         searchInput.setAttribute('disabled', 'disabled'); // Disable search input initially
         window.location.reload();
         
    }
    

    function handleClick(event) {
        const tableId = event.currentTarget.dataset.tableId;

        // Check if there is already an open table
        if (currentOpenTableId) {
            console.log(`Table ${tableId} cannot be opened because Table ${currentOpenTableId} is already open.`);
            return;
        }
currentOpenTableId  =tableId;
        // Open the table if no other table is currently open
        // openTable(tableId);
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
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';

     // Disable search input initially
    console.log('Starting addItemToDatabase with', tableId, itemId, quantity);
    addNewItemToTable(tableId, itemId, quantity);
    // fetch('./checkItemInTable.php', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         tableId: tableId,
    //         itemId: itemId,
    //     }),
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log('checkItemInTable response:', data);
    //     if (data.exists) {
    //         const newQuantity = data.quantity + 1;
    //         updateItemQuantity(tableId, itemId, newQuantity);
    //     } else {
    //         addNewItemToTable(tableId, itemId, quantity);
            
    //     }
    // })
    // .catch(error => {
    //     console.error('Error checking item in table:', error);
    // });
}
let quantityAllowed;
async function addNewItemToTable(tableId, itemId, quantity) {
    try {
        
        await fetchItems(); // Fetch items asynchronously
        
        console.log('Starting addNewItemToTable with', tableId, itemId, quantity);

        let quantityAllowed = undefined;

        // Find the item in idQauntityAllowedQuantity array
        idQauntityAllowedQuantity.forEach(item => {
            if (item.id === itemId) { // Check if item id matches itemId
                quantityAllowed = item.quantity;
            }
        });

        console.log('Quantity Allowed:', quantityAllowed);

        // Proceed with fetch request to addItemToTable.php
        const response = await fetch('./addItemToTable.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tableId: tableId,
                itemId: itemId,
                itemQuantity: quantity,
                // quantityAllowed: quantityAllowed
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('addItemToTable response:', data);

        if (data.success) {
            const printButton = document.getElementById('printButton');
        printButton.removeAttribute('disabled');
             console.log(data);
            console.log(data.item.table_item_id)
            await setDate(data.item.table_item_id,data.item.createdAt);
          await   populateTable(data.item.table_item_id);
          await checkQuantities();
          const cancelButton = document.querySelector('.cancel-reservation-button');
          cancelButton.disabled = true;
          cancelButton.style.opacity = '0.5';
            // updateTableStatuss();
        } else {
            console.error('Failed to add new item to table:', data.message);
        }
    } catch (error) {
        console.error('Error adding new item to table:', error);
    }
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

async function handleBarcode(event) {
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
       .then(async data => {
          if (data && data.length > 0) {
            console.log(data);
            addItemToTable(data[0]);
            await checkQuantities();
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
async function closeTableAfterPrint(tableId) {
    const thirdQuarter = document.getElementById('thirdQuarter');

    // Disable search input
    const searchInput = document.getElementById('searchInput');
    searchInput.setAttribute('disabled', 'disabled'); // Disable search input
    //clear itemsTabeleBody
    const invoiceTable = document.querySelectorAll('#itemsTableBody tr');
    invoiceTable.innerHTML = '';
    // Enable all tables and remove the disabled class
    const allTables = document.querySelectorAll('.table');
    allTables.forEach(table => {
        table.addEventListener('click', handleClick);
        table.classList.remove('disabled');
    });

    // Remove the selected class from the clicked table
    const clickedTable = document.querySelector(`.table[data-table-id="${tableId}"]`);
    if (clickedTable) {
        clickedTable.classList.remove('selected');
    }

    // Clear the third quarter section content
    thirdQuarter.textContent = '';

    // Remove the close button
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.remove();
    }

    // Clear the table content
    clearTable();

    // Update table status to 'closed' in the database
    updateTableIsOpen(tableId, 'closed');

    // Reset currentOpenTableId
    currentOpenTableId = null;

    console.log(tableId);
}
function printModalContent(currentOpenTableId) {
    console.log('clicked');
    const modalContent = document.querySelector('.modal-content').cloneNode(true);

    // Remove the print and cancel buttons from the cloned modal content
    const printButton = modalContent.querySelector('#printButton');
    const cancelButton = modalContent.querySelector('#cancelButton');

    if (printButton) {
        printButton.remove();
    }
    if (cancelButton) {
        cancelButton.remove();
    }

    const printWindow = window.open('', '', 'width=300,height=auto');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Invoice</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        width: 300px;
                    }
                    .modal-content {
                        box-sizing: border-box;
                        padding: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 4px; /* Reduced padding for smaller width */
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    h2, h3 {
                        text-align: center;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                
                ${modalContent.innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();

    // Wait for content to load before printing and closing the window
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
        window.location.reload();
    };
    
}

// function fetchItems() {
//     fetch('./get_items.php') // Update the path to your PHP script
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             populateItems(data);
//         })
//         .catch(error => console.error('Error fetching items:', error));
// }


// function populateItems(items) {
//     console.log(items)
//     const itemsContainer = document.getElementById('items-container');
//     itemsContainer.innerHTML = ''; // Clear existing items

//     items.forEach(item => {
//         if (item.display_home === 'Yes') {
//             const itemBox = document.createElement('div');
//             itemBox.classList.add('item-box');
//             itemBox.textContent = item.name;
//             itemBox.addEventListener('click', () => {
//                 // Handle item click
//                 console.log('Item clicked:', item);
//             });
//             itemsContainer.appendChild(itemBox);
//         }
//     });
// }

// document.addEventListener('DOMContentLoaded', async function() {
   
// });
async function allowedQuantity(){
    await fetch('./get_items.php')
    .then(response => response.json())
    .then(data=>{
        console.log(data);
        idQauntityAllowedQuantity = data.idQuantityItems;
        console.log('allword quantities',idQauntityAllowedQuantity)
    })
    
}
async function fetchItems(tableId) {
    console.log(tableId);
   await fetch('./get_items.php')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // console.log(data); // Log the fetched data to the console
            const itemsContainer = document.getElementById('items-container');
            itemsContainer.innerHTML = ''; // Clear existing itemsf
            idQauntityAllowedQuantity = data.idQuantityItems;
            // Group items by category
            const groupedItems = groupItemsByCategory(data.fullItems);
            console.log(data.fullItems);
            console.log(data.idQuantityItems);
            // Iterate over each category
            Object.keys(groupedItems).forEach(categoryName => {
                // Create category container
                const categoryContainer = document.createElement('div');
                categoryContainer.classList.add('category-container');

                // Create category header
                const categoryHeader = document.createElement('h2');
                categoryHeader.textContent = categoryName;

                // Create items list container
                const itemListContainer = document.createElement('div');
                itemListContainer.classList.add('item-list-container');

                // Populate items within the category
                groupedItems[categoryName].forEach(item => {
                    const listItem = document.createElement('div');
                    listItem.textContent = item.name;
                    listItem.classList.add('item-box', 'blue-bg', 'white-text'); // Dynamically add classes
                    listItem.addEventListener('click', () => {
                        addItemToDatabase(currentOpenTableId, item.id, 1);
                        console.log('Item clicked:', item);
                    });
                    itemListContainer.appendChild(listItem);
                });

                // Append category header and items list container to category container
                categoryContainer.appendChild(categoryHeader);
                categoryContainer.appendChild(itemListContainer);

                // Append category container to the main items container
                itemsContainer.appendChild(categoryContainer);
            });

        })
        .catch(error => console.error('Error fetching items:', error));
}

// Helper function to group items by category
function groupItemsByCategory(items) {
    const groupedItems = {};
    items.forEach(item => {
        if (item.display_home === '1') {
            if (!groupedItems[item.category_name]) {
                groupedItems[item.category_name] = [];
            }
            groupedItems[item.category_name].push(item);
        }
    });

    return groupedItems;
}




document.addEventListener('DOMContentLoaded', fetchItems);

// function populateItems(items) {
//     const itemsContainer = document.getElementById('items-container');
//     itemsContainer.innerHTML = ''; // Clear existing items

//     items.forEach(item => {
//         if (item.display_home === 'Yes') {
//             const itemBox = document.createElement('div');
//             itemBox.classList.add('item-box');
//             itemBox.textContent = item.name;
//             itemBox.addEventListener('click', () => {
//                 // Handle item click
//                 console.log('Item clicked:', item);
//             });
//             itemsContainer.appendChild(itemBox);
//         }
//     });
// }
currentOpenTableId = null;
document.addEventListener('DOMContentLoaded', () => {
    fetchDollarValue();
});

async function fetchDollarValue() {
    try {
        const response = await fetch('./testRate.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const value = await response.text();
        rate=value;
        updateDollarValue(value,rate);
    } catch (error) {
        console.error('Error fetching dollar value:', error);
    }
}

function updateDollarValue(value,rate) {
    const dollarValueElement = document.getElementById('dollar-value');
    dollarValueElement.textContent = `سعر الصرف الحالي ${value}`;
    console.log(rate)
    console.log(`Current dollar value: ${value}`);
}

function fetchDay() {
    fetch('./fetch_day.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('day : ');
            console.log(data[0].id);
            day = data[0].id;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

async function currentDay() {
    try {
        // Make a GET request to fetch the last row data from PHP script
        const response = await fetch('./day.php');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Log the fetched data
        console.log('current day', data);
        dayStatus = data.status;
console.log('dayStatus : ',data.status)
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage: Call the function to log the last row data

async function checkQuantities() {
    try {
        const response = await fetch('./get_items.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Get all table rows once
        const rows = document.querySelectorAll('#itemsTableBody tr');

        // Iterate through each item in idQuantityItems array
        data.idQuantityItems.forEach(item => {
            // Log item ID and quantity for debugging
            console.log(`Item ID: ${item.id}, Quantity: ${item.quantity}`);

            // Find all matching rows by item ID and apply styles
            rows.forEach(row => {
                if (row.getAttribute('itemId') == item.id) {
                    if (item.quantity > 0) {
                        row.style.backgroundColor = 'white';
                        row.style.color = 'black';
                    } else if (item.quantity == 0) {
                        row.style.backgroundColor = 'yellow';
                        row.style.color = 'blue';
                    } else if (item.quantity < 0) {
                        row.style.backgroundColor = 'red';
                        row.style.color = 'white';
                    }
                }
            });
        });

    } catch (error) {
        console.error('Error during fetch:', error.message);
        // Handle network or fetch errors gracefully
    }
}




// Example usage:



// Example usage:
// const itemId = 61; // Replace with the item ID you want to check



// Example usage:
// fetchAllItemMessages();
// Function to get the total price based on data-item-id
async function updateTotal(itemId) {
    // Select the table row with the specified data-item-id
    const row = document.querySelector(`#itemsTable tbody tr[data-item-id="${itemId}"]`);
    
    if (!row) {
        console.error(`Row with data-item-id ${itemId} not found`);
        return null;
    }
    
    // Select the 5th cell (index 4, zero-based) in the row
    const fifthCell = row.cells[4]; // Assuming the structure matches, adjust if needed
    
    if (!fifthCell) {
        console.error(`5th cell not found in row with data-item-id ${itemId}`);
        return null;
    }
    
    // Extract and return the total price
    const totalPrice = fifthCell.textContent.trim();
    return totalPrice;
}

// Example usage:
// const itemIdToFind = 1; // Replace with the itemId you want to find
// const totalPrice = getTotalPriceByItemId(itemIdToFind);

// if (totalPrice !== null) {
//     console.log(`Total price for item ${itemIdToFind}: ${totalPrice}`);
// } else {
//     console.error(`Failed to retrieve total price for item ${itemIdToFind}`);
// }
async function setDate(id,date){
    idAndCreatedAt.id=id;
    idAndCreatedAt.date=date;
}


// async function updateRowUi(table_item_id) {
//     const itemsTableBody = document.getElementById('itemsTableBody');
//     const rowToUpdate = itemsTableBody.querySelector(`tr[table_item_id="${table_item_id}"]`);

//     if (!rowToUpdate) {
//         console.error(`Row with table_item_id ${table_item_id} not found in table.`);
//         return;
//     }

//     // Fetch updated details for the specific table_item_id
//     fetchItemDetails(tableItem.i_id)
//     const tableItem = await fetchTableItemById(table_item_id);

//     // Update the quantity input field in the row
//     const quantityInput = rowToUpdate.querySelector(`input[type="number"]`);
//     quantityInput.value = tableItem.i_quantity;

//     // Optionally update createdAt if needed
//     const createdAtCell = rowToUpdate.cells[5]; // Assuming createdAt is in the sixth cell (index 5)
//     createdAtCell.textContent = tableItem.createdAt; // Update createdAt field
// }


async function reserveTable(event) {
    if (event.key === 'Enter') {
        const inputElement = event.target;
        const customerName = inputElement.value.trim(); // Trim whitespace from input

        // Check if customerName is empty
        if (customerName === '') {
            console.log('Customer name cannot be empty.');
            fetchCustomerName(currentOpenTableId);
            inputElement.blur();
            await fetchTableStatus(currentOpenTableId);
            
             return; // Exit function if customerName is empty
            
        }

        // Proceed with fetch
        fetch('./reserveTable.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerName: customerName,
                tableId: currentOpenTableId
            })
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        //   await   fetchTableStatus(currentOpenTableId);
    //    await enableItemBoxes();
            return response.json();
            
        })
        .then(async (data) => {
            if (data.success) {
                fetchTableStatuses();
                // var reservedTable = document.querySelector('.table[data-table-id="' + currentOpenTableId + '"]');

              
                // reservedTable.style.backgroundColor = 'violet';
                // reservedTable.style.color = 'white';

                const search = document.getElementById('searchInput');
                search.removeAttribute('disabled');



                console.log(data);
                console.log('Table reserved successfully with customer name:', data.customerName);
                
                await fetchCustomerName(currentOpenTableId);
                inputElement.blur(); // Remove focus from the input
                await fetchItems(currentOpenTableId);
                // await fetchTableStatus(tableId);
                // await fetchTableStatus(currentOpenTableId);
               
                const cancelButton = document.querySelector('.cancel-reservation-button');
                cancelButton.disabled = false;
                cancelButton.style.opacity = '1'
                   
              
                // await  enableItemBoxes();
            } else {
                console.error('Failed to reserve table:', data.message || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error during operation:', error.message);
        });
    }
}


async function fetchCustomerName(id) {
    try {
        const response = await fetch('./fetchCustomerName.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableId: id }) // Ensure id is properly passed
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            // Update customer name input field
            await fetchTableStatuses()
            cName=data.customerName;
            console.log(cName)
            document.getElementById('customerName').value = data.customerName;
            // enableItemBoxes();
        } else {
            // Handle error or display message
            // disableItemBoxes();
            console.error('Error fetching customer name:', data.message);
        }
    } catch (error) {
        console.error('There was a problem with fetch operation:', error.message);
    }
}


async function disableItemBoxes() {
    // Select all div elements with the specified classes
    var elements = document.querySelectorAll('div.item-box.blue-bg.white-text');

    // Loop through each selected element
    elements.forEach(function(element) {
        // Add a class to visually indicate "disabled" state or manipulate CSS properties
        element.disabled=true; // Example: Adding a 'disabled' class
        // Alternatively, you can manipulate other properties as needed
        element.style.pointerEvents = 'none'; // Disable pointer events
        element.style.backgroundColor = 'blue';
        element.style.color = 'white';
        element.style.opacity='0.5' // Reduce opacity to indicate disabled state
        // element.setAttribute('disabled', 'true'); // This won't work for div elements
        const cancelButton = document.querySelector('.cancel-reservation-button');
        cancelButton.disabled = true;
        cancelButton.style.opacity = '0.5';
   
        
    });
    console.log('boxes disabled*************************************');
}


async function enableItemBoxes() {
    // Select all div elements with the specified classes
    var elements = document.querySelectorAll('div.item-box.blue-bg.white-text');

    // Loop through each selected element
    elements.forEach(function(element) {
        // Add a class to visually indicate "disabled" state or manipulate CSS properties
        element.classList.add('item-box', 'blue-bg', 'white-text'); // Dynamically add classes
        element.addEventListener('click', () => {
            addItemToDatabase(currentOpenTableId, item.id, 1);
            console.log('Item clicked:', item);
        });
        element.disabled=false;  // Example: Adding a 'disabled' class
        // Alternatively, you can manipulate other properties as needed
        element.style.pointerEvents = 'pointer'; // Disable pointer events
        element.style.backgroundColor = 'darkblue';
        element.style.color = 'white' ;
        element.style.opacity='1' // Reduce opacity to indicate disabled state
        // element.setAttribute('disabled', 'true'); // This won't work for div elements
        // const cancelButton = document.querySelector('.cancel-reservation-button');
        // cancelButton.disabled = false;
        // cancelButton.style.opacity = '1';
    });
    console.log('boxes enabled-----------------------------------');
}


async function unReserveTable(currentOpenTableId) {
  
   const customerName = document.getElementById('customerName');
   
const searchInput=document.getElementById('searchInput');

        fetch('./unReserveTable.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              
                tableId : currentOpenTableId
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async (data) => {
            if (data.success) {
                // await  fetchTableStatuses();
                // var reservedTable = document.querySelector('.table[data-table-id="' + currentOpenTableId + '"]');

              
                // reservedTable.style.backgroundColor = 'darkblue';
                // reservedTable.style.color = 'white';
                console.log(data);
                console.log('table unReserved successfully');
            //    await fetchCustomerName(currentOpenTableId);
                customerName.value=''; // Remove focus from the input
                customerName.disabled = true;
                searchInput.disabled = true;
                searchInput.value = '';
                 disableItemBoxes();
                  fetchTableStatus(currentOpenTableId);
               
                //   var tableElement = document.querySelector('.table[data-table-id="' + currentOpenTableId + '"]')
                //   tableElement.style.background = 'yellow';
                //   tableElement.style.color = 'darkblue';
// await checkQuantities();
// await populateTable();
             
            } else {
                console.error('Failed to unReserve  table:', data.message);

                // Log error message from server
                if (data.message) {
                    console.error('Failed faild: ' + data.message);
                }
            }
        })
        .catch(error => {
            console.error('Error during operation:', error.message);
            // Handle network or fetch errors gracefully
        });
    
}


async function fetchTableStatus(tableId) {
    try {
        const response = await fetch('./fetchTableStatus.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tableId: tableId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            console.log('Table Status:', data.status);
            
            if (data.status === 'reserved') {
                await  enableItemBoxes();
                await fetchCustomerName(tableId);
                const searchInput = document.getElementById('searchInput');
                searchInput.disabled = false;
             
                const customerName = document.getElementById('customerName');
                customerName.disabled = false;
                // const cancelButton = document.querySelector('.cancel-reservation-button');
                // cancelButton.disabled = false;
                // cancelButton.style.opacity = '1';
              
            } else {
               await disableItemBoxes();
                const searchInput = document.getElementById('searchInput');
                searchInput.disabled = true;
                const customerName = document.getElementById('customerName');
                customerName.disabled = false;
                // const cancelButton = document.querySelector('.cancel-reservation-button');
                // cancelButton.disabled = true;
                // cancelButton.style.opacity = '0.5';
            }

            // Handle the retrieved status here
        } else {
            console.error('Failed to fetch table status:', data.error);
            // disableItemBoxes();
            // const searchInput = document.getElementById('searchInput');
            // searchInput.disabled = true;
            // Handle error condition
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        // Handle fetch error
    }
}


async function fetchTableStatuses() {
    fetch('fetch_table_statuses.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            data.forEach(table => {
                var tableId = table.tableId;
                var status = table.status.toLowerCase(); // Convert status to lowercase for consistency
                var isOpen=table.isOpen;
                // Select table element by its ID and apply CSS class based on status
                var tableElement = document.querySelector('.table[data-table-id="' + tableId + '"]');

                // if (isOpen === 'opened') {
                //     tableElement.style.backgroundColor = 'yellow';
                // } else if (isOpen === 'closed' && status === 'reserved') {
                //     tableElement.style.backgroundColor = 'violet';
                //     tableElement.style.color = 'white';
                // } else if (isOpen === 'closed' && status === 'unReserved') {
                //     tableElement.style.backgroundColor = 'darkblue';
                //     tableElement.style.color = 'white';
                // } else if (isOpen === 'closed' && tableId !== 46) {
                //     tableElement.style.backgroundColor = 'darkblue';
                //     tableElement.style.color = 'white';
                // } else if (isOpen === 'closed' && tableId === 46) {
                //     tableElement.style.backgroundColor = 'darkblue';
                // } else {
                //     tableElement.style.backgroundColor = 'darkblue';
                //     tableElement.style.color = 'white';
                // }
                if(isOpen === 'opened'){
                    tableElement.style.backgroundColor = 'yellow';
                        tableElement.style.color = 'darkblue';
                }
                else{
                    if(isOpen === 'closed' && status === 'reserved'){
                        tableElement.style.backgroundColor = 'violet';
                            tableElement.style.color = 'white';
                    } if(isOpen ==='closed' && status === 'unReserved'){
                        tableElement.style.backgroundColor = 'darkblue';
                            tableElement.style.color = 'white';
                            // window.location.reload();
                    }
                }
                
               
                // else if(status==='unReserved' && isOpen === 'closed' && currentOpenTableId == null){
                    
                //     tableElement.style.background='darkblue';
                //     tableElement.style.color='white';
                // }
                // Optionally, you can add an else condition to remove any existing style
                // else {
                //     tableElement.style.backgroundColor = '';
                // }
            });
        })
        .catch(error => {
            console.error('Error fetching table statuses:', error);
        });
}
