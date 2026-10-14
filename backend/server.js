import app from './src/app.js';
import dotenv from 'dotenv';
import { pool } from './src/config/db.js';
import { initFullDatabase } from './src/config/schema.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('Server is running on port ' + PORT);
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL database connected successfully');
    await initFullDatabase();
  } catch (error) {
    console.warn('PostgreSQL database check:', error.message);
  }
});
