module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // Add a new sale
    router.post('/', (req, res) => {
        const { clientName, productName, quantitySold } = req.body;
        console.log(req.body);
        if (!productName || !quantitySold || !clientName) {
            return res.status(400).send("Product name, quantity, and client name are required.");
        }
        db.serialize(() => {
            db.run("BEGIN TRANSACTION;");
    
            // Check current inventory level
            const checkInventorySql = `SELECT quantity FROM products WHERE name = ?`;
            db.get(checkInventorySql, [productName], (err, row) => {
                if (err) {
                    db.run("ROLLBACK;");
                    return res.status(500).send("Error checking inventory: " + err.message);
                }
    
                if (!row || row.quantity < quantitySold) {
                    db.run("ROLLBACK;");
                    return res.status(400).send("Insufficient inventory for the product.");
                }
    
                // Update inventory
                const updateInventorySql = `UPDATE products SET quantity = quantity - ? WHERE name = ?`;
                db.run(updateInventorySql, [quantitySold, productName], function(err) {
                    if (err) {
                        db.run("ROLLBACK;");
                        return res.status(500).send("Error updating inventory: " + err.message);
                    }
    
                    // Record the sale
                    const recordSaleSql = `INSERT INTO sales (product_name, quantity, client_name, date, total_earned) VALUES (?, ?, ?, datetime('now'), (SELECT price FROM products WHERE name = ?) * ?)`;
                    db.run(recordSaleSql, [productName, quantitySold, clientName, productName, quantitySold], function(err) {
                        if (err) {
                            db.run("ROLLBACK;");
                            return res.status(500).send("Error recording sale: " + err.message);
                        }
    
                        db.run("COMMIT;");
                        res.send("Sale recorded successfully.");
                    });
                });
            });
        });
    });
    

    // GET route for fetching sales
    router.get('/', (req, res) => {
        const fetchSalesSql = "SELECT * FROM sales;"; // Adjust SQL query if needed

        db.all(fetchSalesSql, [], (err, rows) => {
            if (err) {
                res.status(500).send("Error fetching sales: " + err.message);
                return;
            }

            res.send(rows);
        });
    });

    // Delete a sale
    router.delete('/', (req, res) => {
        const {
            saleId
        } = req.body;

        const deleteSaleSql = "DELETE FROM sales WHERE id = ?";

        db.run(deleteSaleSql, [saleId], function(err) {
            if (err) {
                res.status(500).send("Error deleting sale: " + err.message);
                return;
            }

            if (this.changes === 0) {
                res.status(404).send("Sale not found.");
                return;
            }

            res.send("Sale deleted successfully.");
        });
    });

    return router;
};