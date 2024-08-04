let rateUSD; // Variable to store the fetched dollar rate

async function fetchInvoicesByDate(selectedDate) {
    try {
        const response = await fetch('./fetchInvoices.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedDate: selectedDate })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Data:', data);
        populateTables(data.tables);

        // Calculate and display total sales for the day
        const totalSales = calculateTotalSales(data.tables);
        displayTotalSales(totalSales);

    } catch (error) {
        console.error('Error:', error);
    }
}

function populateTables(tables) {
    const container = document.getElementById('tables-container');
    container.innerHTML = ''; // Clear existing tables

    tables.forEach(table => {
        Object.values(table.invoices).forEach(invoice => {
            const tableElement = document.createElement('table');
            tableElement.className = 'invoice-table';

            const tableCaption = document.createElement('caption');
            tableCaption.textContent = `Table ID: ${table.table_id}, Invoice ID: ${invoice.invoice_id}`;
            tableElement.appendChild(tableCaption);

            const tableHeader = `
                <thead>
                    <tr>
                        <th>Table ID</th>
                        <th>Invoice ID</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
            `;
            tableElement.innerHTML += tableHeader;

            const tableBody = document.createElement('tbody');
            let totalInvoicePrice = 0;
            invoice.items.forEach(item => {
                const row = document.createElement('tr');
                
                const tableIdCell = document.createElement('td');
                tableIdCell.textContent = table.table_id;
                row.appendChild(tableIdCell);

                const invoiceIdCell = document.createElement('td');
                invoiceIdCell.textContent = invoice.invoice_id;
                row.appendChild(invoiceIdCell);

                const itemNameCell = document.createElement('td');
                itemNameCell.textContent = item.item_name;
                row.appendChild(itemNameCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = item.quantity;
                row.appendChild(quantityCell);

                const totalPriceCell = document.createElement('td');
                totalPriceCell.textContent = item.total_price.toFixed(2);
                row.appendChild(totalPriceCell);

                totalInvoicePrice += item.total_price;
                tableBody.appendChild(row);
            });

            // Add the total price row
            const totalRow = document.createElement('tr');
            const totalLabelCell = document.createElement('td');
            totalLabelCell.colSpan = 4;
            totalLabelCell.style.textAlign = 'right';
            totalLabelCell.textContent = 'Total (USD):'; // Adjusted label for USD total
            totalRow.appendChild(totalLabelCell);
            
            const totalPriceCell = document.createElement('td');
            const totalInvoicePriceUSD = totalInvoicePrice / rateUSD; // Calculate total in USD
            totalPriceCell.textContent = totalInvoicePriceUSD.toFixed(2);
            totalRow.appendChild(totalPriceCell);
            
            totalRow.style.fontWeight = 'bold';
            tableBody.appendChild(totalRow);
            
            tableElement.appendChild(tableBody);
            container.appendChild(tableElement);

                // Add the total price row
                const totalRowLbp = document.createElement('tr');
                const totalLabelCellLbp = document.createElement('td');
                totalLabelCell.colSpan = 4;
                totalLabelCell.style.textAlign = 'right';
                totalLabelCell.textContent = 'Total (LBP):'; // Adjusted label for USD total
                totalRow.appendChild(totalLabelCellLbp);
                
                const totalPriceCellLbp = document.createElement('td');
                const totalInvoicePriceLbp = totalInvoicePrice ; // Calculate total in USD
                totalPriceCell.textContent = totalInvoicePriceUSD.toFixed(2);
                totalPriceCellLbp.appendChild(totalInvoicePriceLbp);
                
                totalPriceCellLbp.style.fontWeight = 'bold';
                tableBody.appendChild(totalPriceCellLbp);
                
                tableElement.appendChild(tableBody);
                container.appendChild(tableElement);


            
            
        });
    });
}

function calculateTotalSales(tables) {
    let totalSales = 0;
    tables.forEach(table => {
        Object.values(table.invoices).forEach(invoice => {
            invoice.items.forEach(item => {
                totalSales += item.total_price;
            });
        });
    });
    return totalSales;
}

function displayTotalSales(totalSales) {
    const totalSalesContainer = document.getElementById('total-sales');
    totalSalesContainer.textContent = `Total Sales for the Day: ${totalSales.toFixed(2)}`;
}

document.getElementById('fetch-invoices-button').addEventListener('click', () => {
    const dateInput = document.getElementById('dateSelect');
    const selectedDate = dateInput.value;
    fetchInvoicesByDate(selectedDate);
});


async function fetchDollarValue() {
    try {
        const response = await fetch('../home/testRate.php');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const value = await response.text();
        rateUSD = parseFloat(value); // Parse the fetched value as float to store rateUSD
        console.log('Fetched rate USD:', rateUSD);
        
        // After fetching rateUSD, update the UI or perform any necessary operations
        updateDollarValue(value, rateUSD); // Example function to update UI
        
    } catch (error) {
        console.error('Error fetching dollar value:', error);
    }
}

//fetchDollarValue(); // Fetch rate when the page loads
