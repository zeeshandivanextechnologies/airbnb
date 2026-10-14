import pkg from 'pg';
const { Pool } = pkg;

const localPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'airbnb_db',
  user: 'postgres',
  password: 'admin'
});

const neonPool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_pr8IlEJ0nRAQ@ep-small-smoke-b5y5uls7-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function syncDatabases() {
  try {
    console.log('Connecting to Local PostgreSQL...');
    await localPool.query('SELECT NOW()');
    console.log('✅ Local PostgreSQL connected!');

    console.log('Connecting to Live Neon PostgreSQL...');
    await neonPool.query('SELECT NOW()');
    console.log('✅ Live Neon PostgreSQL connected!');

    // Fetch all tables from local
    const tableRes = await localPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

    const tableNames = tableRes.rows.map(r => r.table_name);
    console.log('Found local tables:', tableNames);

    // Sync order respecting dependencies
    const preferredOrder = ['users', 'blocked_users', 'admins', 'hosting_types', 'host_categories', 'listings', 'bookings'];
    const syncList = [
      ...preferredOrder.filter(t => tableNames.includes(t)),
      ...tableNames.filter(t => !preferredOrder.includes(t))
    ];

    for (const table of syncList) {
      console.log(`\n🔄 Syncing table: "${table}"...`);
      const localData = await localPool.query(`SELECT * FROM ${table}`);
      console.log(`  Local has ${localData.rows.length} rows in "${table}".`);

      if (localData.rows.length === 0) continue;

      const cols = Object.keys(localData.rows[0]);
      const colNames = cols.map(c => `"${c}"`).join(', ');

      for (const row of localData.rows) {
        const values = cols.map(c => row[c]);
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

        const conflictClause = cols.includes('id') 
          ? `ON CONFLICT ("id") DO UPDATE SET ${cols.filter(c => c !== 'id').map(c => `"${c}" = EXCLUDED."${c}"`).join(', ')}`
          : cols.includes('email')
          ? `ON CONFLICT ("email") DO UPDATE SET ${cols.filter(c => c !== 'email').map(c => `"${c}" = EXCLUDED."${c}"`).join(', ')}`
          : 'ON CONFLICT DO NOTHING';

        const insertQuery = `
          INSERT INTO ${table} (${colNames}) 
          VALUES (${placeholders}) 
          ${conflictClause}
        `;

        try {
          await neonPool.query(insertQuery, values);
        } catch (insertErr) {
          console.warn(`  Warning syncing row in ${table}:`, insertErr.message);
        }
      }

      // Reset auto-increment sequence if id column exists
      if (cols.includes('id')) {
        try {
          await neonPool.query(`
            SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM ${table};
          `);
        } catch (seqErr) {
          // ignore if no sequence
        }
      }
      console.log(`  ✅ Synced "${table}" successfully.`);
    }

    console.log('\n🎉 ALL LOCAL DATA SUCCESSFULLY SYNCED TO LIVE NEON DB!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
    process.exit(1);
  }
}

syncDatabases();
