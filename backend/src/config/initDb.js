import { pool } from './db.js';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  try {
    console.log('🔄 Setting up PostgreSQL database tables for Airbnb Admin...');

    // 1. Create Admins Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Super Admin',
        avatar VARCHAR(10) DEFAULT 'SA',
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log('✅ "admins" table created successfully.');

    // 2. Hash default password 'admin'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // 3. Seed initial admin users if not exist
    const adminsToSeed = [
      {
        name: 'Super Admin',
        email: 'admin@airbnb.internal',
        role: 'Super Admin',
        avatar: 'SA'
      },
      {
        name: 'Finance Manager',
        email: 'finance.lead@airbnb.internal',
        role: 'Finance Manager',
        avatar: 'FM'
      },
      {
        name: 'Senior Moderator',
        email: 'support.lead@airbnb.internal',
        role: 'Senior Moderator',
        avatar: 'SM'
      }
    ];

    for (const adm of adminsToSeed) {
      await pool.query(`
        INSERT INTO admins (name, email, password, role, avatar, status)
        VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
        ON CONFLICT (email) DO UPDATE 
        SET password = EXCLUDED.password;
      `, [adm.name, adm.email, hashedPassword, adm.role, adm.avatar]);
    }

    console.log('✅ Seeded default admin accounts into PostgreSQL DB:');
    const allAdmins = await pool.query('SELECT id, name, email, role, created_at FROM admins');
    console.table(allAdmins.rows);

    await pool.end();
    console.log('🎉 Database setup completed!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
