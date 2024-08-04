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
                // await fetchDay();
                await newDay();
                fetchSalesData()
            });
        })

});
function fetchDay() {
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
            day = data[0].id;
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
        console.log('Fetched data:', data); // Log fetched data for debugging
        day = data.id;
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
        

        salesContainer.innerHTML = ''; // Clear existing content
        totalSalesValue.textContent = `Total Sales for the Day LBP : ${data.total_sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Display total sales in local currency
        totalSalesDollar.textContent = `${(data.total_sales / rate).toFixed(2)} $`; // Display total sales in dollars
        // dayDateElement.textContent = `Date: ${data.day_date}`; // Display the date of the day

        Object.values(data.tables).forEach(table => {
            const tableDiv = document.createElement('div');
            tableDiv.classList.add('table');
            const tableHeader = document.createElement('h2');
            tableHeader.textContent = `Table ${table.table_id}`;
            tableDiv.appendChild(tableHeader);

            Object.values(table.invoices).forEach(invoice => {
                const invoiceDiv = document.createElement('div');
                invoiceDiv.classList.add('invoice');
                const invoiceHeader = document.createElement('h3');
                invoiceHeader.textContent = `Invoice ID: ${invoice.invoice_id}`;
                invoiceDiv.appendChild(invoiceHeader);

                let totalInvoicePrice = 0; // Initialize total invoice price

                invoice.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.innerHTML = `
                        <p><strong>Item Name:</strong> ${item.item_name}</p>
                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                        <p><strong>Total Price:</strong> ${item.total_price.toFixed(2)}</p>
                    `;
                    invoiceDiv.appendChild(itemDiv);

                    totalInvoicePrice += item.total_price; // Sum item total prices
                });

                // Display total invoice price
                const totalInvoicePriceElement = document.createElement('p');
                totalInvoicePriceElement.classList.add('total-invoice-price');
                totalInvoicePriceElement.textContent = `Total Invoice Price: ${totalInvoicePrice.toFixed(2)}`;
                invoiceDiv.appendChild(totalInvoicePriceElement);

                tableDiv.appendChild(invoiceDiv);
            });

            salesContainer.appendChild(tableDiv);
        });
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
