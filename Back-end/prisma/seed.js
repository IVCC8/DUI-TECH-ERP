require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    console.log('Seeding data with pg...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Clean tables
        await client.query('DELETE FROM "FinancialRecord"');
        await client.query('DELETE FROM "Lead"');
        await client.query('DELETE FROM "Product"');
        await client.query('DELETE FROM "Employee"');

        // Financial Records
        await client.query(`
            INSERT INTO "FinancialRecord" (type, amount, status, "createdAt") VALUES
            ('CREDIT_SALE', 50000, 'PAID', NOW()),
            ('CREDIT_SALE', 30000, 'PENDING', NOW()),
            ('CREDIT_SALE', 20000, 'PENDING', NOW()),
            ('INVOICE', 15000, 'PAID', NOW())
        `);

        // Leads
        await client.query(`
            INSERT INTO "Lead" (source, status, "createdAt") VALUES
            ('Web', 'CLOSED_WON', NOW()),
            ('Web', 'CLOSED_WON', NOW()),
            ('LinkedIn', 'CLOSED_LOST', NOW()),
            ('Referral', 'OPEN', NOW()),
            ('Web', 'CLOSED_WON', NOW()),
            ('LinkedIn', 'CLOSED_WON', NOW()),
            ('Instagram', 'CLOSED_LOST', NOW()),
            ('Web', 'OPEN', NOW())
        `);

        // Products
        await client.query(`
            INSERT INTO "Product" (name, price, "costPrice", stock, brand, category, status) VALUES
            ('Laptop Dell XPS 15', 35000, 28000, 10, 'Dell', 'Laptops', 'Activo'),
            ('Monitor LG 27"', 6500, 4500, 15, 'LG', 'Monitores', 'Activo'),
            ('Teclado Razer', 2500, 1500, 30, 'Razer', 'Accesorios', 'Activo')
        `);

        // Employees
        await client.query(`
            INSERT INTO "Employee" (name, status, "hiredAt", "leftAt") VALUES
            ('Juan Perez', 'ACTIVE', NOW(), NULL),
            ('Maria Garcia', 'ACTIVE', NOW(), NULL),
            ('Carlos Lopez', 'ACTIVE', NOW(), NULL),
            ('Ana Martinez', 'INACTIVE', NOW(), NOW()),
            ('Luis Rodriguez', 'ACTIVE', NOW(), NULL)
        `);

        await client.query('COMMIT');
        console.log('Seeding finished successfully.');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error during seeding:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
