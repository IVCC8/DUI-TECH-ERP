const pool = require('../config/db');

// Basic in-memory cache for KPIs
const cache = {
    summary: { data: null, timestamp: 0 },
    TTL: 5 * 60 * 1000 // 5 minutes
};

// KPI: Módulo de Finanzas - DSO (Days Sales Outstanding)
exports.getFinanceKPIs = async (req, res) => {
    try {
        const creditSalesRes = await pool.query('SELECT SUM(amount) as total FROM "FinancialRecord" WHERE type = \'CREDIT_SALE\'');
        const accountsReceivableRes = await pool.query('SELECT SUM(amount) as total FROM "FinancialRecord" WHERE status = \'PENDING\'');

        const totalCreditSales = parseFloat(creditSalesRes.rows[0].total) || 1;
        const avgAR = parseFloat(accountsReceivableRes.rows[0].total) || 0;
        const days = 30;

        const dso = (avgAR / totalCreditSales) * days;

        res.json({
            dso: parseFloat(dso.toFixed(2)),
            totalCreditSales,
            accountsReceivable: avgAR,
            interpretation: "Valor bajo = Gestión eficiente y mayor liquidez."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// KPI: Módulo de Ventas y CRM - Tasa de Conversión
exports.getSalesKPIs = async (req, res) => {
    try {
        const totalLeadsRes = await pool.query('SELECT COUNT(*) as count FROM "Lead"');
        const closedLeadsRes = await pool.query('SELECT COUNT(*) as count FROM "Lead" WHERE status = \'CLOSED_WON\'');

        const totalLeads = parseInt(totalLeadsRes.rows[0].count);
        const closedLeads = parseInt(closedLeadsRes.rows[0].count);
        const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

        res.json({
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            totalLeads,
            closedLeads,
            interpretation: "% de leads que se convierten en pedidos reales."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// KPI: Logística e Inventarios - Rotación de Inventario
exports.getInventoryKPIs = async (req, res) => {
    try {
        // Optimized: Only select necessary columns
        const productsRes = await pool.query('SELECT "costPrice", stock FROM "Product"');
        const products = productsRes.rows;
        
        const totalCostValue = products.reduce((acc, p) => acc + (parseFloat(p.costPrice) * (p.stock || 0)), 0);
        const cogs = totalCostValue * 0.8;
        const avgInventory = totalCostValue || 1;

        const rotation = cogs / avgInventory;

        res.json({
            rotation: parseFloat(rotation.toFixed(2)),
            cogs,
            avgInventory,
            interpretation: "Alta rotación = Buenas ventas y poco stock inmovilizado."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// KPI: Módulo de Recursos Humanos - Tasa de Rotación de Personal
exports.getHRKPIs = async (req, res) => {
    try {
        const activeRes = await pool.query('SELECT COUNT(*) as count FROM "Employee" WHERE status = \'ACTIVE\'');
        const inactiveRes = await pool.query('SELECT COUNT(*) as count FROM "Employee" WHERE status = \'INACTIVE\'');

        const activeEmployees = parseInt(activeRes.rows[0].count);
        const inactiveEmployees = parseInt(inactiveRes.rows[0].count);

        const totalEmployees = activeEmployees + inactiveEmployees;
        const avgEmployees = totalEmployees > 0 ? (activeEmployees + totalEmployees) / 2 : 1;
        const turnover = totalEmployees > 0 ? (inactiveEmployees / avgEmployees) * 100 : 0;

        res.json({
            turnover: parseFloat(turnover.toFixed(2)),
            leavers: inactiveEmployees,
            avgEmployees,
            interpretation: "Frecuencia con la que empleados abandonan la empresa."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getKPISummary = async (req, res) => {
    // Basic cache check
    const now = Date.now();
    if (cache.summary.data && (now - cache.summary.timestamp < cache.TTL)) {
        return res.json(cache.summary.data);
    }

    try {
        const [finance, sales, inventory, hr] = await Promise.all([
            getFinanceDataInternal(),
            getSalesDataInternal(),
            getInventoryDataInternal(),
            getHRDataInternal()
        ]);
        
        const summaryData = { finance, sales, inventory, hr };
        cache.summary = { data: summaryData, timestamp: now };
        
        res.json(summaryData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFinanceDataInternal = async () => {
    const crRes = await pool.query('SELECT SUM(amount) as total FROM "FinancialRecord" WHERE type = \'CREDIT_SALE\'');
    const arRes = await pool.query('SELECT SUM(amount) as total FROM "FinancialRecord" WHERE status = \'PENDING\'');
    const totalCreditSales = parseFloat(crRes.rows[0].total) || 1;
    const avgAR = parseFloat(arRes.rows[0].total) || 0;
    return parseFloat(((avgAR / totalCreditSales) * 30).toFixed(2));
};

const getSalesDataInternal = async () => {
    const leadsRes = await pool.query('SELECT COUNT(*) as count FROM "Lead"');
    const wonRes = await pool.query('SELECT COUNT(*) as count FROM "Lead" WHERE status = \'CLOSED_WON\'');
    const totalLeads = parseInt(leadsRes.rows[0].count);
    const closedLeads = parseInt(wonRes.rows[0].count);
    return totalLeads > 0 ? parseFloat(((closedLeads / totalLeads) * 100).toFixed(2)) : 0;
};

const getInventoryDataInternal = async () => {
    const productsRes = await pool.query('SELECT "costPrice", stock FROM "Product"');
    const totalCostValue = productsRes.rows.reduce((acc, p) => acc + (parseFloat(p.costPrice) * (p.stock || 0)), 0);
    const avgInventory = totalCostValue || 1;
    return parseFloat(((totalCostValue * 0.8) / avgInventory).toFixed(2));
};

const getHRDataInternal = async () => {
    const activeRes = await pool.query('SELECT COUNT(*) as count FROM "Employee" WHERE status = \'ACTIVE\'');
    const inactiveRes = await pool.query('SELECT COUNT(*) as count FROM "Employee" WHERE status = \'INACTIVE\'');
    const active = parseInt(activeRes.rows[0].count);
    const inactive = parseInt(inactiveRes.rows[0].count);
    const total = active + inactive;
    const avg = total > 0 ? (active + total) / 2 : 1;
    return total > 0 ? parseFloat(((inactive / avg) * 100).toFixed(2)) : 0;
};

// Also expose as exports for other use cases if needed
exports.getFinanceData = getFinanceDataInternal;
exports.getSalesData = getSalesDataInternal;
exports.getInventoryData = getInventoryDataInternal;
exports.getHRData = getHRDataInternal;
