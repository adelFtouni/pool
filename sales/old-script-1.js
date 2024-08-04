let rate;
let totalSalesLbpValue;
let totalSalesDollarValue;
let day;

window.onload = function() {
    // Get the current date
    const currentDate = new Date();

    // Adjust to UTC+2 (Eastern European Time)
    const utcOffset = 2; // UTC+2
    const localOffset = currentDate.getTimezoneOffset() / 60; // Current local offset in hours
    const utcDate = new Date(currentDate.getTime() + (utcOffset - localOffset) * 60 * 60 * 1000);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for UTC+2 date
    const dayOfWeek = utcDate.getUTCDay();

    // Define an array of weekday names in Arabic
    const arabicWeekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    // Get the Arabic name of the day using the dayOfWeek index
    const arabicDayName = arabicWeekdays[dayOfWeek];

    // Format the date as desired (example: Fri Jun 28 2024)
    const formattedDate = utcDate.toDateString();

    // Display the formatted day name and date in an HTML element
    const dayDateElement = document.getElementById('day-date');
    dayDateElement.textContent = `${arabicDayName}, ${formattedDate}`;
};





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
       if(!data.sucess){
        document.getElementById('newDay').setAttribute('disabled', 'true');
        document.getElementById('newDay').style.opacity = '0.7';
        document.getElementById('newDay').style.background = 'red';
        document.getElementById('newDay').textContent= `لا يمكنك إغلاق الصّندوق لأن لا مبيع حتى الان`;
    } else {
        // Optionally enable the 'newDay' button if there are no reserved tables
        document.getElementById('newDay').removeAttribute('disabled');
    }
       
        // Log fetched data for debugging
        day = data.day.day_id;
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

        // Loop through invoices
        data.invoices.forEach(invoice => {
            const invoiceDiv = document.createElement('div');
            invoiceDiv.style.background = '#95d1f8';
            invoiceDiv.style.border = '2px solid blue';
            invoiceDiv.style.padding = '2rem';
            invoiceDiv.style.marginBottom = '1rem'; // Added margin between invoices

            // Invoice ID
            const invoiceId = document.createElement('h4');
            invoiceId.textContent = `Invoice ID: ${invoice.invoice_id}`;
            invoiceDiv.appendChild(invoiceId);

            // Created At
            const createdAt = document.createElement('h4');
            createdAt.textContent = `Created At: ${invoice.createdAt}`;
            invoiceDiv.appendChild(createdAt);

            // Customer Name
            const customerName = document.createElement('h4');
            customerName.textContent = `Customer Name: ${invoice.customerName}`;
            invoiceDiv.appendChild(customerName);

            // Table ID
            const tableId = document.createElement('h4');
            tableId.textContent = `Table ID: ${invoice.tableId}`;
            invoiceDiv.appendChild(tableId);

            // Table creation for items
            const table = document.createElement('table');
            table.classList.add('custom-table'); // Assuming you have defined the custom-table class in CSS

            // Table headers (thead)
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Item Name', 'Quantity', 'Total Price'];

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

                // Item Name
                const itemNameCell = document.createElement('td');
                itemNameCell.textContent = item.item_name;
                itemRow.appendChild(itemNameCell);

                // Quantity
                const quantityCell = document.createElement('td');
                quantityCell.textContent = item.quantity;
                itemRow.appendChild(quantityCell);

                // Total Price
                const totalPriceCell = document.createElement('td');
                totalPriceCell.textContent = item.total_price.toLocaleString(); // Format with commas
                itemRow.appendChild(totalPriceCell);

                tbody.appendChild(itemRow);
            });

            // Calculate total price for the invoice
            const totalRow = document.createElement('tr');
            const totalCell = document.createElement('td');
            totalCell.colSpan = 2; // Span across two columns (Item Name and Quantity)
            totalCell.textContent = 'Total:';
            totalRow.appendChild(totalCell);

            const totalValueCell = document.createElement('td');
            const invoiceTotal = invoice.items.reduce((acc, item) => acc + item.total_price, 0);
            totalValueCell.textContent = invoiceTotal.toLocaleString(); // Format with commas
            totalRow.appendChild(totalValueCell);

            tbody.appendChild(totalRow);

            table.appendChild(tbody);
            invoiceDiv.appendChild(table);

            // Append the whole invoice div to the sales container
            salesContainer.appendChild(invoiceDiv);
        });

        // Display total sales
        const totalSalesInfo = document.createElement('h3');
        totalSalesInfo.textContent = `Total Sales: $${data.total_sales.toLocaleString()}`; // Format with commas
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
    dollarValueElement.textContent = `Current Dollar Value: ${value}`;
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
