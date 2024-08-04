let rate;
let totalSalesLbpValue;
let totalSalesDollarValue;
let day;
let dayDate;
let currentOpenInvoice;

// JavaScript (script.js)

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('myModal');
    const btn = document.getElementById('newDay');
    btn.classList.add('setOld'); // Corrected: remove the dot (.) before the class name
    const span = document.getElementsByClassName('close')[0];
    const submitButton = document.getElementById('submitPassword');

    btn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    submitButton.onclick = function() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        // Add your logic to handle password submission here
        // console.log('Password submitted:', password);
        if(password == 70674518){
            submitButton.onclick = ()=>{
                setDayToOld();
            }
        }else{
            document.getElementById('wrong').textContent= 'wrong password';
        }
        // For demo purposes, close the modal after submitting password
        // modal.style.display = 'none';
    }
});

// function populateDayDate(dayDate) {
//     // Split the input date string into date and time parts
//     const parts = dayDate.split(' ');
//     const datePart = parts[0]; // 'YYYY-MM-DD'
//     const timePart = parts[1]; // 'HH:mm:ss'

//     // Split the date part into year, month, and day
//     const dateParts = datePart.split('-');
//     const year = parseInt(dateParts[0], 10);
//     const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed (0 = January)
//     const day = parseInt(dateParts[2], 10);

//     // Split the time part into hours, minutes, and seconds
//     const timeParts = timePart.split(':');
//     const hours = parseInt(timeParts[0], 10);
//     const minutes = parseInt(timeParts[1], 10);
//     const seconds = parseInt(timeParts[2], 10);

//     // Create a Date object using the parsed components (UTC time)
//     const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

//     // Adjust to UTC+2 (Eastern European Time)
//     utcDate.setUTCHours(utcDate.getUTCHours() + 2);

//     // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for local date
//     const dayOfWeek = utcDate.getDay();

//     // Define an array of weekday names in English
//     const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//     // Get the English name of the day using the dayOfWeek index
//     const dayName = weekdays[dayOfWeek];

//     // Format the date as desired (example: Fri Jun 28 2024)
//     const formattedDate = utcDate.toDateString();

//     // Display the formatted day name and date in an HTML element
//     const dayDateElement = document.getElementById('day-date');
//     dayDateElement.textContent = `${dayName}, ${formattedDate}`;
// }

function populateDayDate(dayDate) {
    // Parse the date string into a Date object
    const date = new Date(dayDate);
    
    // Define an array of weekday names
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayOfWeekIndex = date.getDay();
    const dayOfWeek = weekdays[dayOfWeekIndex];
    
    // Get the day of the month
    const dayOfMonth = date.getDate();
    
    // Get the current date
    const currentDate = new Date();
    
    // Check if the current day is Sunday
    const isSunday = currentDate.getDay() === 0;
    
    // Log the day without the time
    console.log(`Day without time: ${dayOfMonth}`);
    
    // Log the day of the week
    console.log(`Day of the week: ${dayOfWeek}`);
    
    // Log whether the current day is Sunday or not
    console.log(`Current day is Sunday: ${isSunday}`);

        const dayDateElement = document.getElementById('day-date');
    dayDateElement.textContent = `${dayOfWeek}, ${dayDate}`;
  }
document.addEventListener('DOMContentLoaded', async function () {
    // Get the button element
    await canCloseDay();
    const deleteButton = document.getElementById('deleteAll');

    // Disable the button by default
    deleteButton.disabled = true;

    fetchDollarValue()
        .then(() => {
            fetchSalesData();
        }).then(() => {
            document.getElementById('newDay').addEventListener('click', async function () {
                // Example rate fetching logic (replace with actual implementation)
                // const fetchedRate = 50.25; // Example rate value fetched from some source
                 await fetchDay();
                await newDay();
                fetchSalesData()
            });
        })

});
async function fetchDay() {
    fetch('./sales.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('day : ');
            console.log(data[0].id);
            //  day = data[0].id;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
async function fetchSalesData() {
    try {
        const response = await fetch('./sales.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); 
        // Log fetched data for debugging
        day = data.day.day_id;
        dayDate = data.day.day_date;
        populateDayDate(dayDate)
        // If there's an error, log it and stop processing
        if (data.error) {
            console.error(data.error);
            return;
        }
        totalSalesLbpValue = parseFloat(data.total_sales.toFixed(2));
        totalSalesDollarValue = parseFloat((data.total_sales / rate).toFixed(2));
        
        const salesContainer = document.getElementById('sales-container');
        const totalSalesValue = document.getElementById('total-sales-value');
        const totalSalesDollar = document.getElementById('total-sales-value-dollar');
        
        // createInvoiceTables(data)
        salesContainer.innerHTML = ''; // Clear existing content
        totalSalesValue.textContent = ` ${data.total_sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Display total sales in local currency
        totalSalesDollar.textContent = `${(data.total_sales / rate).toFixed(2)} $`; // Display total sales in dollars
        //  dayDateElement.textContent = `Date: ${data.day_date}`; // Display the date of the day
    //   data.invoices.forEach(invoice => {
    //     const InvoiceDiv = document.createElement('div');
    //     const invoiceId= document.createElement('h2');
    //     invoiceId.textContent = invoice.invoice_id;
    //     InvoiceDiv.appendChild(invoiceId)
    //     salesContainer.appendChild(InvoiceDiv)
    //   });
// ///////////////////////////////////////////
fetch('sales.php')
    .then(response => response.json())
    .then(data => {
        const salesContainer = document.getElementById('sales-container');
        salesContainer.innerHTML = ''; // Clear previous content if any

        const dayId = data.day.day_id;
        const dayDate = data.day.day_date;

        // Display day information
        const dayInfo = document.createElement('h3');
        dayInfo.textContent = `Day ID: ${dayId} - Date: ${dayDate}`;
        salesContainer.appendChild(dayInfo);

        // Separate invoices by tableId 46 and others
        const invoicesWithTableId46 = [];
        const otherInvoices = [];

        data.invoices.forEach(invoice => {
            if (invoice.tableId == 46) {
                invoicesWithTableId46.push(invoice);
            } else {
                otherInvoices.push(invoice);
            }
        });

        // Display invoices with tableId 46 first
        invoicesWithTableId46.forEach(invoice => {
            const invoiceDiv = createInvoiceDiv(invoice, true);
            salesContainer.appendChild(invoiceDiv);
        });

        // Display other invoices
        otherInvoices.forEach(invoice => {
            const invoiceDiv = createInvoiceDiv(invoice, false);
            salesContainer.appendChild(invoiceDiv);
        });

        // Display total sales
        const totalSalesInfo = document.createElement('h3');
        totalSalesInfo.textContent = `المبيع الإجمالي: L.L. ${data.total_sales.toLocaleString()}`; // Format with commas
        salesContainer.appendChild(totalSalesInfo);
    })
    .catch(error => {
        console.error('Error fetching or parsing data:', error);
    });



// ///////////////////////////////////////////

    } catch (error) {
        console.error('Error fetching sales data:', error);
    }
}
function createInvoiceDiv(invoice, isTableId46) {
    console.log(invoice)
    const invoiceDiv = document.createElement('div');
    invoiceDiv.id = invoice.invoice_id;
    invoiceDiv.style.background = isTableId46 ? '#70ff6b' : '#95d1f8';
    // if(invoice.tableId == null ){
    //     invoice.style.background = '#b3c6db';
    // }
    invoiceDiv.style.border = '2px solid blue';
    invoiceDiv.style.padding = '2rem';
    invoiceDiv.style.marginBottom = '1rem'; // Added margin between invoices
    
    // name
    const name = document.createElement('h2');
    name.textContent = 'إستراحة أرزة لبنان';
    invoiceDiv.appendChild(name);
    // Invoice ID
    const invoiceId = document.createElement('h4');
    invoiceId.id = invoice.invoice_id;
    invoiceId.textContent = `رقم الفاتورة: ${invoice.invoice_id}`;
    invoiceDiv.appendChild(invoiceId);

    // Created At
    const createdAt = document.createElement('h4');
    const dbDateTime = invoice.createdAt;
    const dateObject = new Date(dbDateTime);
    dateObject.setHours(dateObject.getHours() + 1);
    const formattedDateTime = `${dateObject.getFullYear()}-${('0' + (dateObject.getMonth() + 1)).slice(-2)}-${('0' + dateObject.getDate()).slice(-2)} ${('0' + dateObject.getHours()).slice(-2)}:${('0' + dateObject.getMinutes()).slice(-2)}:${('0' + dateObject.getSeconds()).slice(-2)}`;
    createdAt.textContent = `التاريخ و الوقت: ${formattedDateTime}`;
    invoiceDiv.appendChild(createdAt);

    // Customer Name
    const customerName = document.createElement('h4');
    customerName.textContent = `إسم الزبون: ${invoice.customerName}`;
    invoiceDiv.appendChild(customerName);

    // Table ID
    const tableId = document.createElement('h4');
    tableId.textContent = isTableId46 ? `مبيع بدون طاولة` : `رقم الطاولة : ${invoice.tableId}`;
    invoiceDiv.appendChild(tableId);

    // Table creation for items
    const table = document.createElement('table');
    table.classList.add('custom-table'); // Assuming you have defined the custom-table class in CSS

    // Table headers (thead)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['إسم الصنف', 'الكميّة', "الإفرادي",'الإجمالي','حذف'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body (tbody)
    const tbody = document.createElement('tbody');

    // Populate items
    invoice.items.forEach(item => {
        const itemRow = document.createElement('tr');
        itemRow.setAttribute('table_item_id', item.table_item_id);

        // Item Name
        const itemNameCell = document.createElement('td');
        itemNameCell.textContent = item.item_name;
        itemRow.appendChild(itemNameCell);

        // Quantity
        const quantityCell = document.createElement('td');
quantityCell.textContent = item.quantity;
quantityCell.classList.add('quantity');
quantityCell.setAttribute('id', item.table_item_id); // Set id attribute
quantityCell.setAttribute('quantity', item.quantity); 
quantityCell.setAttribute('item_id', item.item_id); 
itemRow.appendChild(quantityCell);
;

        const priceCell =  document.createElement('td');
        priceCell.textContent = (item.total_price/item.quantity).toLocaleString();
        itemRow.appendChild(priceCell);
        // Total Price
        const totalPriceCell = document.createElement('td');
        totalPriceCell.textContent = item.total_price.toLocaleString(); // Format with commas
        itemRow.appendChild(totalPriceCell);

        // const buttonsInModal = document.querySelectorAll('.modal-verlay .modal-content div .custom-table tbody button');
        // console.log(buttonsInModal)
            const deleteButton=document.createElement('td');
        const deleteItem = document.createElement('button');
        deleteItem.style.background='red';
        deleteItem.style.color='white';
        deleteItem.style.padding='5px';
        deleteItem.textContent = "حذف";
        deleteItem.style.opacity='0.5';
        deleteItem.setAttribute('id', item.table_item_id); // Set id attribute
        deleteItem.setAttribute('quantity', item.quantity); 
        deleteItem.setAttribute('item_id', item.item_id);;
        deleteItem.setAttribute('disabled',true);
        deleteButton.appendChild(deleteItem);
        itemRow.appendChild(deleteButton);
        tbody.appendChild(itemRow);
    });
console.log(rate);
    // Calculate total price for the invoice
    const totalRow = document.createElement('tr');
    const totalCell = document.createElement('td');
    totalCell.colSpan = 3; // Span across two columns (Item Name and Quantity)
    totalCell.textContent = 'الإجمالي';
    totalRow.appendChild(totalCell);

    const totalValueCell = document.createElement('td');
    const invoiceTotal = invoice.items.reduce((acc, item) => acc + item.total_price, 0);
    totalValueCell.textContent = invoiceTotal.toLocaleString(); // Format with commas
    totalRow.appendChild(totalValueCell);

    tbody.appendChild(totalRow);


    ////////////////////////////
 const totalRowD = document.createElement('tr');
    const totalCellD = document.createElement('td');
    totalCellD.colSpan = 3; // Span across two columns (Item Name and Quantity)
    totalCellD.textContent = '$$الإجمالي';
    totalRowD.appendChild(totalCellD);

    const totalValueCellD = document.createElement('td');
    const invoiceTotalD = invoice.items.reduce((acc, item) => acc + item.total_price, 0);
    totalValueCellD.textContent = (invoiceTotalD/rate).toLocaleString(); // Format with commas
    totalRowD.appendChild(totalValueCellD);

    tbody.appendChild(totalRowD);
    /////////////////////////////////////
    table.appendChild(tbody);
    invoiceDiv.appendChild(table);

    // Edit Invoice Button
    const editButton = document.createElement('button');
    editButton.textContent = 'عرض الفاتورة';
    editButton.id = invoice.invoice_id;
    editButton.classList.add('existing-button-class');
    editButton.addEventListener('click', () => openModal(invoice));
    invoiceDiv.appendChild(editButton);



    const printButton = document.createElement('button');
    printButton.textContent = 'طباعة الفاتورة';
    // editButton.id = invoice.invoice_id;
    printButton.classList.add('existing-button-class');
    printButton.style.marginLeft = '8rem';
    printButton.addEventListener('click', () =>  printInvoice(invoiceDiv));
    invoiceDiv.appendChild(printButton);
    return invoiceDiv;
}

// Function to open modal with invoice details
function openModal(invoice) {
    console.log(invoice);
    currentOpenInvoice = invoice.invoice_id;
    console.log(currentOpenInvoice);
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);

    // Modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-contentt');
    modalOverlay.appendChild(modalContent)
    // Modal close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'إغلاق';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    modalContent.appendChild(closeButton);

    // Prepare invoice details for modal
    const invoiceDiv = createInvoiceDiv(invoice, false); // Assuming isTableId46 is always false in modal

// Select all buttons that are inside modal content and have a class




    // Find all quantity <td> elements in the invoiceDiv
    const quantityTds = invoiceDiv.querySelectorAll('.quantity'); // Select all elements with class 'quantity'

    // Iterate over each quantity <td> and replace with an input field
    quantityTds.forEach(quantityTd => {
        // Create an input field for quantity
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number'; // Assuming quantity is numeric
        quantityInput.value = quantityTd.textContent.trim(); // Populate with actual invoice quantity
        quantityInput.disabled = false; // Ensure input field is enabled
        quantityInput.style.width = '2rem';
        quantityInput.id = quantityTd.id;
        quantityInput.oldQuantity = quantityTd.quantity;
        quantityInput.itemId = quantityTd.item_id;

        // Add event listener for quantity input
        quantityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const newQuantity = quantityInput.value;
                // Call updateInvoice function with updated quantity if needed
                updateInvoice(newQuantity, quantityTd);
            }
        });

        // Clear existing content and append the input field
        quantityTd.textContent = '';
        quantityTd.appendChild(quantityInput);
    });

    // Append modified invoice details to modal content
    

    // const deleteInvoice = document.createElement('button');
    // deleteInvoice.textContent = 'حذف الفاتورة';
    //  deleteInvoice.id = invoice.invoice_id;
    // deleteInvoice.addEventListener('click', () => deleteInvoiceFromDb(invoice.invoice_id,invoice.items));
    // deleteInvoice.style.background = 'red';
    // deleteInvoice.style.marginLeft = '8rem';
    // deleteInvoice.style.opacity = '1';
    // newnewnew
    const deleteInvoice = document.createElement('button');
deleteInvoice.textContent = 'حذف الفاتورة';
deleteInvoice.id = invoice.invoice_id;
deleteInvoice.style.background = 'red';
deleteInvoice.style.marginLeft = '8rem';
deleteInvoice.style.opacity = '1';

deleteInvoice.addEventListener('click', () => {
    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modal.appendChild(modalContent);

    const confirmMessage = document.createElement('p');
    confirmMessage.textContent = 'Are you sure you want to delete this invoice?';
    modalContent.appendChild(confirmMessage);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginRight = '10px';
    deleteButton.addEventListener('click', async () => {
        await deleteInvoiceFromDb(invoice.invoice_id, invoice.items);
        closeModal(); // Assuming closeModal function exists to close the modal
    });
    modalContent.appendChild(deleteButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        closeModal(); // Close the modal without deleting
    });
    modalContent.appendChild(cancelButton);

    // Function to close the modal
    function closeModal() {
        document.body.removeChild(modal);
    }
});
    //endendend


    
   

    invoiceDiv.appendChild(deleteInvoice);
    modalContent.appendChild(invoiceDiv);

    // Select all buttons that are in the 5th cells (columns) of tables within modal content
    const buttons = modalContent.querySelectorAll('table tbody tr td:nth-child(5) button');

    // Iterate over the NodeList of buttons and log them to the console
    buttons.forEach(button => {
        button.removeAttribute('disabled');
        button.style.opacity = '1';
        button.onclick = function() {
            deleteRow(button.id, button.getAttribute('item_id'), button.getAttribute('quantity'));
        };
    });

    // Append modal content to modal overlay
    modalOverlay.appendChild(modalContent);
    const buttonsWithClass = modalContent.querySelectorAll('button.existing-button-class');
console.log(buttonsWithClass)
// Iterate over the NodeList of buttons and log them to the console
buttonsWithClass.forEach(button => {
    button.style.display = 'none'; // Hide the button
});
}




document.addEventListener('DOMContentLoaded', function () {
    fetchDollarValue()
        .then(() => {
            fetchSalesData();
        });
});



async function fetchDollarValue() {
    try {
        const response = await fetch('../home/testRate.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const value = await response.text();
        rate = parseFloat(value);
        updateDollarValue(value);
    } catch (error) {
        console.error('Error fetching dollar value:', error);
    }
}

function updateDollarValue(value) {
    const dollarValueElement = document.getElementById('dollar-value');
    dollarValueElement.textContent = `سعر الصّرف الحالي : ${value}`;
    console.log(`Current dollar value: ${value}`);
}

async function downloadExcelFile() {
    try {
        const deleteButton = document.getElementById('deleteAll');

        const response = await fetch('./backup.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'sales_report.xls';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // Enable the delete button after downloading the file
        deleteButton.disabled = false;
    } catch (error) {
        console.error('Error downloading the Excel file:', error);
    }
}

// JavaScript function to delete rows
function deleteRows() {
    fetch('./emptySystem.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            alert(data); // Display success or error message
            window.location.reload(); // Reload the page after alert is dismissed
        })
        .catch(error => {
            console.error('Error deleting rows:', error);
            alert('Error deleting rows. See console for details.');
        });
}


// Assume rate is pre-fetched and available in your JavaScript environment
// Example rate value

// Function to add a new row to the day table
// Function to fetch rate and add a new row to the day table
// Function to insert a new day
async function insertDay() {
    try {
        // Make a POST request to insert a new day
        const insertResponse = await fetch('./newDay.php', {
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

// Function to update day to 'done'
async function setDayToOld() {
    console.log(day)
    try {
        // Make a POST request to update the day
        const updateResponse = await fetch('./oldDay.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                day_id: day,
                rate: rate,
                totalSalesLbpValue: totalSalesLbpValue,
                totalSalesDollarValue: totalSalesDollarValue
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update day');
        }

        const updateData = await updateResponse.json();

        if (updateData.update_success) {
            console.log('Day status updated successfully');
             window.location.reload()
        } else {
            console.error('Error updating day:', updateData.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage:


// // Example usage of setDayToOld() for updating existing day
// setDayToOld(day, rate, totalSalesLbpValue, totalSalesDollarValue);

// // Example usage of insertDay() for inserting new day
// insertDay(rate);


async function canCloseDay() {
    fetch('./canCloseDay.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update UI based on reserved table count
            console.log(data); // For debugging purposes
            
            // Check if reservedCount is greater than 0
            if (data.reservedCount > 0) {
                // Disable the 'newDay' button if there are reserved tables
                document.getElementById('newDay').setAttribute('disabled', 'true');
                document.getElementById('newDay').style.opacity = '0.7';
                document.getElementById('newDay').style.background = 'red';
                document.getElementById('newDay').textContent= `لا يمكنك إغلاق الصّندوق لأن هناك ${data.reservedCount} طاولات محجوزة`;
            } else {
                // Optionally enable the 'newDay' button if there are no reserved tables
                document.getElementById('newDay').removeAttribute('disabled');
            }
        })
        .catch(error => {
            console.error('Error fetching reserved table count:', error);
        });
}


// Assume you have fetched data stored in jsonData variable
// jsonData structure should be similar to the JSON response you generate in PHP

// function createInvoiceTables(jsonData) {
//     // Assuming jsonData contains 'day', 'invoices', and 'total_sales' as described
//     const dayInfo = jsonData.day;
//     const invoices = jsonData.invoices;
//     const totalSales = jsonData.total_sales;

//     // Selecting the container where you want to append the tables
//     const container = document.getElementById('invoice-container');
    
//     // Clear the container before appending new content
//     container.innerHTML = '';

//     // Loop through each invoice and create a table
//     invoices.forEach((invoice, index) => {
//         const invoiceId = invoice.invoice_id;
//         const createdAt = invoice.createdAt;
//         const items = invoice.items;

//         // Creating elements for Invoice ID and Created At
//         const invoiceIdHeader = document.createElement('h2');
//         invoiceIdHeader.textContent = `Invoice ID: ${invoiceId}`;
//         container.appendChild(invoiceIdHeader);

//         const createdAtHeader = document.createElement('h2');
//         createdAtHeader.textContent = `Created At: ${createdAt}`;
//         container.appendChild(createdAtHeader);

//         // Creating table element
//         const table = document.createElement('table');
//         table.classList.add('invoice-table');

//         // Creating table header row
//         const headerRow = document.createElement('tr');
//         const itemNameHeader = document.createElement('th');
//         itemNameHeader.textContent = 'Item Name';
//         const quantityHeader = document.createElement('th');
//         quantityHeader.textContent = 'Quantity';
//         const totalPriceHeader = document.createElement('th');
//         totalPriceHeader.textContent = 'Total Price';
//         headerRow.appendChild(itemNameHeader);
//         headerRow.appendChild(quantityHeader);
//         headerRow.appendChild(totalPriceHeader);
//         table.appendChild(headerRow);

//         // Adding rows for each item in the invoice
//         items.forEach(item => {
//             const row = document.createElement('tr');
//             const itemNameCell = document.createElement('td');
//             itemNameCell.textContent = item.item_name;
//             const quantityCell = document.createElement('td');
//             quantityCell.textContent = item.quantity;
//             const totalPriceCell = document.createElement('td');
//             totalPriceCell.textContent = item.total_price;
//             row.appendChild(itemNameCell);
//             row.appendChild(quantityCell);
//             row.appendChild(totalPriceCell);
//             table.appendChild(row);
//         });

//         // Append the table to the container
//         container.appendChild(table);

//         // Creating elements for Table ID and Total
//         const tableIdHeader = document.createElement('h2');
//         tableIdHeader.textContent = `Table ID: ${invoice.table_id}`;
//         container.appendChild(tableIdHeader); // Adjust if table_id is available in your data

//         // Adding Total of the invoice in USD and LBP
//         const totalUSD = document.createElement('p');
//         totalUSD.textContent = `Total (USD): $${invoice.total_price_usd}`;
//         container.appendChild(totalUSD);

//         const totalLBP = document.createElement('p');
//         totalLBP.textContent = `Total (LBP): ${invoice.total_price_lbp} LBP`;
//         container.appendChild(totalLBP);

//         // Adding a separator between invoices
//         if (index < invoices.length - 1) {
//             const separator = document.createElement('hr');
//             container.appendChild(separator);
//         }
//     });

//     // Adding total sales for all invoices
//     const totalSalesUSD = document.createElement('p');
//     totalSalesUSD.textContent = `Total Sales (USD): $${totalSales}`;
//     container.appendChild(totalSalesUSD);

//     const totalSalesLBP = document.createElement('p');
//     totalSalesLBP.textContent = `Total Sales (LBP): ${totalSales} LBP`; // Assuming total_sales is in LBP
//     container.appendChild(totalSalesLBP);
// }

// // Example usage assuming jsonData is fetched from your PHP endpoint
// // Replace 'jsonData' with the actual variable containing your JSON response
// // createInvoiceTables(jsonData);
async function updateInvoice(newQuantity,quantityTd){
console.log(newQuantity,quantityTd);

try {
    // Make a POST request to update the day
    const updateResponse = await fetch('./updateInvoice.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newQuantity: newQuantity,
            table_item_id: quantityTd.id,
            item_id: quantityTd.getAttribute('item_id'),
            oldQuantity: quantityTd.getAttribute('quantity')
        })
    });

    if (!updateResponse.ok) {
        // console.log(newQuantity,table_item_id,item_id,oldQuantity)
        throw new Error('Failed to update invoice');
        
    }

    const updateData = await updateResponse.json();

    if (updateData.update_success) {
        console.log(updateData)
        console.log('invoice uodated successfully');
        //  window.location.reload()
        await fetchSalesData();
        closeModal();
    } else {
        console.error('Error updating invoice:', updateData.message);
    }

} catch (error) {
    console.error('Error:', error);
}
}


function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        document.body.removeChild(modalOverlay);
    }
}
async function deleteRow(id,item_id,quantity){
    console.log(id);
    console.log(item_id);
    console.log(quantity);

    try {
        // Make a POST request to update the day
        const updateResponse = await fetch('./deleteInvoiceRow.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: quantity,
                table_item_id: id,
                item_id: item_id,
                // oldQuantity: quantityTd.getAttribute('quantity')
            })
        });
    
        if (!updateResponse.ok) {
            // console.log(newQuantity,table_item_id,item_id,oldQuantity)
            throw new Error('Failed to delete row');
            
        }
    
        const updateData = await updateResponse.json();
    
        if (updateData.update_success) {
            console.log(updateData)
            console.log('row deleted successfully');
            //  window.location.reload()
            await fetchSalesData();
            closeModal();
        } else {
            console.error('Error deleting row:', updateData.message);
        }
    
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteInvoiceFromDb(invoiceId,array){
    console.log(invoiceId);
   
    console.log(array)
    try {
        // Make a POST request to update the day
        const updateResponse = await fetch('./deleteInvoiceFromDb.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                invoiceId: invoiceId,
                 arrayOfData : array   
            })
        });
    
        if (!updateResponse.ok) {
            // console.log(newQuantity,table_item_id,item_id,oldQuantity)
            throw new Error('Failed to delete invoice');
            
        }
    
        const updateData = await updateResponse.json();
    
        if (updateData.update_success) {
            console.log(updateData)
            console.log('invoice deleted successfully');
            //  window.location.reload()
            await fetchSalesData();
            closeModal();
        } else {
            console.error('Error deleting invoice:', updateData.message);
        }
    
    } catch (error) {
        console.error('Error:', error);
    }
}

function printInvoice(invoiceDiv) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.open();

    // Build the HTML content for printing
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Print Invoice</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .invoice-container { width: 20%; margin: auto; }
                .invoice-header { font-size: 1.2rem; margin-bottom: 1rem; }
                .custom-table { border-collapse: collapse; width: 25%; margin-top: 1rem; }
                .custom-table th, .custom-table td { border: none; padding: 8px; text-align: center; }
                .custom-table th { background-color: #f2f2f2; }
                .custom-table td { font-size: 0.9rem; }
                .button-container { margin-top: 1rem; display: none; }
                button { display: none; }
                @media print {
                    body { margin: 0; }
                    .invoice-container { width: 100%; margin: 0; }
                }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <div class="invoice-container">
                ${invoiceDiv.innerHTML}
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
