require('dotenv').config();
const { Pool } = require('pg');

// Sanitize DATABASE_URL to avoid ERR_INVALID_URL on Windows/Express
let dbUrl = (process.env.DATABASE_URL || '').trim();
if (dbUrl.startsWith('"') && dbUrl.endsWith('"')) {
    dbUrl = dbUrl.substring(1, dbUrl.length - 1);
}

// Extract individual params if needed for fallback or robustness
// For now, we'll try to use the connectionString if it looks valid,
// otherwise we use a hardcoded fallback that we know works on this system.
const useFallback = !dbUrl || dbUrl.includes('\r') || dbUrl.includes('\n');

const config = useFallback ? {
    user: 'postgres',
    password: 'Temporal#123',
    host: 'localhost',
    port: 5432,
    database: 'erp_bd',
    ssl: false
} : {
    connectionString: dbUrl,
    ssl: false
};

// Purge PG environment variables to prevent automated (and potentially crashing) URL parsing by pg-pool
Object.keys(process.env).forEach(key => {
    if (key.startsWith('PG') || key === 'DATABASE_URL') {
        delete process.env[key];
    }
});

const pool = new Pool(config);

pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client', err);
});

module.exports = pool;
