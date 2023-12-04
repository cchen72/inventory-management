const express = require('express');
const cors = require('cors');
const getJson = require('get-json');
const sqlite3 = require('sqlite3').verbose();
const productsRouter = require('./products');
const clientsRouter = require('./clients');
const salesRouter = require('./sales');

const app = express();
const port = 3002;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

const dbPath = __dirname + '/demo.db';

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    createTables(db);
    console.log('Connected to the DEMO database.');
});

app.use('/products', productsRouter(db));
app.use('/clients', clientsRouter(db));
app.use('/sales', salesRouter(db));

app.listen(port, () => {
    console.log('Listening on port:  ' + port);
});

function createTables(db) {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                name VARCHAR(50) PRIMARY KEY,
                description VARCHAR(256),
                price INTEGER NOT NULL,
                quantity INTEGER NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS clients (
                name VARCHAR(50) PRIMARY KEY,
                contact_info VARCHAR(256),
                address VARCHAR(256)
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name VARCHAR(50) NOT NULL,
                product_name VARCHAR(50) NOT NULL,
                quantity INTEGER NOT NULL,
                date DATE NOT NULL,
                total_earned INTEGER NOT NULL,
                FOREIGN KEY(client_name) REFERENCES clients(name),
                FOREIGN KEY(product_name) REFERENCES products(name)
            );
        `);
    });
}


function cleanup() {
    console.log('\nCleanup called');
    db.close();
    process.exit();
}


process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
