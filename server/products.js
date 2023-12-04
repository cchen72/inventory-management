module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // Fetch products from the backend
    router.get('/', (req, res) => {
        let sql = `SELECT * FROM products;`
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
            res.send(rows);
        });
    });

    // Add a new product to the database
    router.post('/', (req, res) => {
        console.log(req.body); // Log the entire body
        let {
            name,
            quantity,
            price,
            description
        } = req.body;
        let sql = `INSERT INTO products (name, quantity, price, description) 
                    VALUES (?, ?, ?, ?)`;

        db.run(sql, [name, quantity, price, description], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
            res.send('Product added successfully!');
        });
    });

    // Update an existing product
    router.put('/', (req, res) => {
        const {
            name,
            quantity,
            price,
            description
        } = req.body;

        if (!name) {
            return res.status(400).send('Product name is required.');
        }

        // First, check if the product exists in the database
        db.get('SELECT * FROM products WHERE name = ?', [name], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            // If the product doesn't exist, send a 404 error
            if (!row) {
                return res.status(404).send('Product not found.');
            }

            // If the product exists, proceed to update
            let fieldsToUpdate = [];
            let sqlValues = [];

            if (quantity !== undefined) {
                fieldsToUpdate.push('quantity = ?');
                sqlValues.push(quantity);
            }
            if (price !== undefined) {
                fieldsToUpdate.push('price = ?');
                sqlValues.push(price);
            }
            if (description !== undefined) {
                fieldsToUpdate.push('description = ?');
                sqlValues.push(description);
            }

            if (fieldsToUpdate.length === 0) {
                return res.status(400).send('No fields to update.');
            }

            let sql = `UPDATE products SET ${fieldsToUpdate.join(', ')} WHERE name = ?`;
            sqlValues.push(name);

            db.run(sql, sqlValues, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err.message);
                }
                res.send('Product updated successfully!');
            });
        });
    });

    // Delete a product
    router.delete('/', (req, res) => {
        let name = req.body.name;

        // find the product first
        db.get('SELECT * FROM products WHERE name = ?', [name], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }

            // if the product doesn't exist, send a 404 error
            if (!row) {
                return res.status(404).send('Product not found.');
            }

            // if the product exists, proceed to delete
            let sql = `DELETE FROM products WHERE name = ?`;
            db.run(sql, [name], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err.message);
                }
                res.send('Product deleted successfully!');
            });
        });
    });

    return router;
};