module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // Fetch clients from the backend
    router.get('/', (req, res) => {
        let sql = `SELECT * FROM clients;`
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
            res.send(rows);
        });
    });

    // Add a new client to the database
    router.post('/', (req, res) => {
        let { name, contact_info, address } = req.body;
        let sql = `INSERT INTO clients (name, contact_info, address) 
                    VALUES (?, ?, ?)`;

        db.run(sql, [name, contact_info, address], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
            res.send('Client added successfully!');
        });
    });

    // Update an existing client
    router.put('/', (req, res) => {
        const { name, contact_info, address } = req.body;
    
        if (!name) {
            return res.status(400).send('Client name is required.');
        }
    
        // First, check if the client exists in the database
        db.get('SELECT * FROM clients WHERE name = ?', [name], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
    
            // If the client doesn't exist, send a 404 error
            if (!row) {
                return res.status(404).send('Client not found.');
            }
    
            // If the client exists, proceed to update
            let fieldsToUpdate = [];
            let sqlValues = [];
    
            if (contact_info !== undefined) {
                fieldsToUpdate.push('contact_info = ?');
                sqlValues.push(contact_info);
            }
            if (address !== undefined) {
                fieldsToUpdate.push('address = ?');
                sqlValues.push(address);
            }
    
            if (fieldsToUpdate.length === 0) {
                return res.status(400).send('No fields to update.');
            }
    
            let sql = `UPDATE clients SET ${fieldsToUpdate.join(', ')} WHERE name = ?`;
            sqlValues.push(name);
    
            db.run(sql, sqlValues, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err.message);
                }
                res.send('Client updated successfully!');
            });
        });
    });

    // Delete a client
    router.delete('/', (req, res) => {
        let name = req.body.name;

        let sql = `DELETE FROM clients WHERE name = ?`;
        db.run(sql, [name], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Error deleting client.");
            }

            if (this.changes === 0) {
                return res.status(404).send('Client not found.');
            }

            res.send('Client deleted successfully!');
        });
    });

    return router;
};
