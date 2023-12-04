$(document).ready(function () {
    // Fetch products on page load
    fetchProducts();

    // Handle the form submission for adding a new product
    $('#insertGoodForm').submit(function (event) {
        event.preventDefault();
        addProduct();
    });

    // Handle the form submission for updating a product
    $('#updateGoodForm').submit(function (event) {
        event.preventDefault();
        updateProduct();
    });

    // Handle the form submission for deleting a product
    $('#deleteGoodForm').submit(function (event) {
        event.preventDefault();
        deleteProduct();
    });
    
    //Switching between pages
    $('#homeLink').click(function(event) {
        event.preventDefault();
        fetchProducts();
        $('#mainContent').show();
        $('#clientContent').hide();
        $('#saleContent').hide();
    });
    
    // Switch to the client page
    $('#clientLink').click(function(event) {
        event.preventDefault(); // prevent default link behaviour
        // Fetch clients when switching to the client page
        fetchClients();
        $('#clientContent').show();
        $('#mainContent').hide();
        $('#saleContent').hide();
    });

    // Handle the form submission for adding a new client
    $('#insertClientForm').submit(function (event) {
        event.preventDefault();
        addClient();
    });

    // Handle the form submission for updating a client
    $('#updateClientForm').submit(function (event) {
        event.preventDefault();
        updateClient();
    });

    // Handle the form submission for deleting a client
    $('#deleteClientForm').submit(function (event) {
        event.preventDefault();
        deleteClient();
    });

    $('#saleLink').click(function(event) {
        event.preventDefault();
        // Fetch sales when switching to the sales page
        fetchSales();
        $('#saleContent').show();
        $('#mainContent').hide();
        $('#clientContent').hide();
    });

    // Handle the form submission for adding a new sale
    $('#insertSaleForm').submit(function (event) {
        event.preventDefault();
        addSale();
    });
    $('#deleteSaleForm').submit(function (event) {
        event.preventDefault();
        deleteSale();
    });
});

/******************************
* PRODUCTS CURD OPERATIONS
**************************** */

// Fetch products from the backend
function fetchProducts() {
    $.ajax({
        url: 'http://localhost:3002/products',
        method: 'GET',
        success: function (products) {
            displayProducts(products);
            console.log(products);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error fetching products', error);
        }
    });
}

// Display products in the 'viewGood' container
function displayProducts(products) {
    const container = $('#viewGood');

    const table = $('#viewTable');
    table.empty(); // Clear existing content
    container.find('p').remove();

    if (products.length === 0) {
        container.append('<p>No products available.</p>');
        return;
    }

    const thead = $('<thead><tr><th>Name</th><th>Quantity</th><th>Price</th><th>Description</th></tr></thead>');
    table.append(thead);

    const tbody = $('<tbody></tbody>');
    products.forEach(product => {
        const tr = $('<tr></tr>');
        tr.append(`<td>${product.name}</td>`);
        tr.append(`<td>${product.quantity}</td>`);
        tr.append(`<td>${product.price}</td>`);
        tr.append(`<td>${product.description}</td>`);
        tbody.append(tr);
    });
    table.append(tbody);
}

// Add a new product
function addProduct() {
    const name = $('#goodName').val();
    let quantity = $('#goodQuantity').val();
    let price = $('#goodPrice').val();
    let description = $('#goodDescription').val();

    // change empty strings to null
    quantity = quantity !== "" ? quantity : null;
    price = price !== "" ? price : null;
    // description = description !== "" ? description : null;

    $.ajax({
        url: 'http://localhost:3002/products',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, quantity, price, description }),
        success: function () {
            alert('Product added successfully!');
            $('#insertGoodForm')[0].reset(); // Reset the form
            fetchProducts(); // Refresh the list
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error adding product', error);
        }
    });
}

// Update a product
function updateProduct() {
    const name = $('#updateGoodName').val();
    let productUpdateData = { name };

    // Only add fields to the payload if they have a value
    const quantity = $('#updateGoodQuantity').val();
    if (quantity) {
        productUpdateData.quantity = quantity;
    }

    const price = $('#updatePrice').val();
    if (price) {
        productUpdateData.price = price;
    }

    const description = $('#newDescription').val();
    if (description) {
        productUpdateData.description = description;
    }

    $.ajax({
        url: 'http://localhost:3002/products',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(productUpdateData),
        success: function () {
            alert('Product updated successfully!');
            $('#updateGoodForm')[0].reset(); // Reset the form
            fetchProducts(); // Refresh the list
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error updating product', error);
        }
    });
}


// Delete a product
function deleteProduct() {
    const name = $('#deleteGoodName').val();

    $.ajax({
        url: 'http://localhost:3002/products',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ name }),
        success: function () {
            alert('Product deleted successfully!');
            $('#deleteGoodForm')[0].reset(); // Reset the form
            fetchProducts(); // Refresh the list
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error deleting product', error);
        }
    });
}

/******************************
* CLIENTS CURD OPERATIONS
**************************** */

// Fetch clients from the backend
function fetchClients() {
    $.ajax({
        url: 'http://localhost:3002/clients',
        method: 'GET',
        success: function (clients) {
            displayClients(clients);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            // alert('Error fetching clients!');
            console.error('Error fetching clients', error);
        }
    });
}

// Display clients in the 'viewClient' container
function displayClients(clients) {
    // Similar to displayProducts, but for displaying client data
    const container = $('#viewClient');

    const table = $('#viewClientTable');
    table.empty(); // Clear existing content
    container.find('p').remove();

    if (clients.length === 0) {
        // Append a message if there are no clients
        container.append('<p>No clients available.</p>');
        return;
    }

    const thead = $('<thead><tr><th>Name</th><th>Contact Info</th><th>Address</th></tr></thead>');
    table.append(thead);

    const tbody = $('<tbody></tbody>');
    clients.forEach(client => {
        const tr = $('<tr></tr>');
        tr.append(`<td>${client.name}</td>`);
        tr.append(`<td>${client.contact_info}</td>`);
        tr.append(`<td>${client.address}</td>`);
        tbody.append(tr);
    });
    table.append(tbody);
}

// Add a new client
function addClient() {
    const name = $('#clientName').val();
    const contact_info = $('#clientContactInfo').val();
    const address = $('#clientAddress').val();

    $.ajax({
        url: 'http://localhost:3002/clients',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, contact_info, address }),
        success: function () {
            alert('Client added successfully!');
            $('#insertClientForm')[0].reset();
            fetchClients();
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error adding client', error);
        }
    });
}

// Update a client
function updateClient() {
    const name = $('#updateClientName').val();
    let clientUpdateData = { name };

    const contact_info = $('#updateClientContactInfo').val();
    if (contact_info) {
        clientUpdateData.contact_info = contact_info;
    }

    const address = $('#updateClientAddress').val();
    if (address) {
        clientUpdateData.address = address;
    }

    $.ajax({
        url: 'http://localhost:3002/clients',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(clientUpdateData),
        success: function () {
            alert('Client updated successfully!');
            $('#updateClientForm')[0].reset();
            fetchClients();
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error updating client', error);
        }
    });
}

// Delete a client
function deleteClient() {
    const name = $('#deleteClientName').val();

    $.ajax({
        url: 'http://localhost:3002/clients',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ name }),
        success: function () {
            alert('Client deleted successfully!');
            $('#deleteClientForm')[0].reset();
            fetchClients();
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error deleting client', error);
        }
    });
}


/******************************
 * SALES CURD OPERATIONS
 * *************************** */


// Fetch sales from the backend
function fetchSales() {
    $.ajax({
        url: 'http://localhost:3002/sales',
        method: 'GET',
        success: function (sales) {
            displaySales(sales);
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error fetching sales', error);
        }
    });
}

// Display sales in the 'viewSale' container
function displaySales(sales) {
    const container = $('#viewSale');

    const table = $('#viewSaleTable');
    table.empty(); // Clear existing content
    container.find('p').remove();

    if (sales.length === 0) {
        container.append('<p>No sales available.</p>');
        return;
    }

    const thead = $('<thead><tr><th>ID</th><th>Client Name</th><th>Product Name</th><th>Quantity</th><th>Date</th><th>Total Earned</th></tr></thead>');
    table.append(thead);

    const tbody = $('<tbody></tbody>');
    sales.forEach(sale => {
        const tr = $('<tr></tr>');
        tr.append(`<td>${sale.id}</td>`);
        tr.append(`<td>${sale.client_name}</td>`);
        tr.append(`<td>${sale.product_name}</td>`);
        tr.append(`<td>${sale.quantity}</td>`);
        tr.append(`<td>${sale.date}</td>`);
        tr.append(`<td>${sale.total_earned}</td>`);
        tbody.append(tr);
    });
    table.append(tbody);
}

// Add a new sale
function addSale() {
    const clientName = $('#saleClientName').val();
    const productName = $('#saleProductName').val();
     const quantitySold = $('#saleQuantity').val();
    // const quantity = parseInt($('#saleQuantity').val(), 10); // Ensure quantity is an integer

    console.log(clientName, productName, quantitySold);

    $.ajax({
        url: 'http://localhost:3002/sales', // URL for adding a sale
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ clientName, productName, quantitySold }),
        success: function () {
            alert('Sale added successfully!');
            $('#insertSaleForm')[0].reset(); // Reset the sale form
            fetchSales(); // Refresh the sales list
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error adding sale', error);
        }
    });
}

//delete sale
function deleteSale() {
    const saleId = $('#deleteSaleId').val();

    $.ajax({
        url: 'http://localhost:3002/sales',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ saleId }),
        success: function () {
            alert('Sale deleted successfully!');
            $('#deleteSaleForm')[0].reset();
            fetchSales();
        },
        error: function(xhr, status, error) {
            alert(xhr.responseText);
            console.error('Error deleting sale', error);
        }
    });
}

function updateSale() {
    // ... existing code for updating a sale ...
}