import { pool } from './db.js';

async function updateAllColumns() {
  try {
    console.log('🔄 Adding all extended user columns to live database...');
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_settings JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_info JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vat_info JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(50) DEFAULT 'English';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS known_languages JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_referral_links JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS about_me TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_answers JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stamps_enabled BOOLEAN DEFAULT true;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS automatic_translation BOOLEAN DEFAULT true;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'INR';
    `);
    console.log('✅ Successfully added tax_info and all profile columns to live Neon PostgreSQL!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating columns:', err.message);
    process.exit(1);
  }
}

updateAllColumns();
