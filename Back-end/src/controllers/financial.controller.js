const pool = require('../config/db');

const getAllFinancialRecords = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, type, amount, description, status, "createdAt" FROM "FinancialRecord" ORDER BY "createdAt" DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createFinancialRecord = async (req, res) => {
    const { type, amount, description, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO "FinancialRecord" (type, amount, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, amount, description, status || 'PENDING']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllFinancialRecords,
    getFinancialRecords: getAllFinancialRecords, // Alias
    createFinancialRecord
};
