const pool = require('../config/db');

const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, brand, category, model, price, "costPrice", stock FROM "Product" ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    const { name, brand, category, model, price, costPrice, stock } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO "Product" (name, brand, category, model, price, "costPrice", stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, brand, category, model, price, costPrice, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM "Product" WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    deleteProduct
};
