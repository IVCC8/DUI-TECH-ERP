const pool = require('../config/db');

const getAllEmployees = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, status, department, "hiredAt" FROM "Employee" ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    const { name, email, role, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO "Employee" (name, email, role, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, role, status || 'ACTIVE']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployees: getAllEmployees, // Alias for router compatibility
    createEmployee
};
