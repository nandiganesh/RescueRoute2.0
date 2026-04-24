require('dotenv').config();
const db = require('./config/db');

async function test() {
  try {
    const d = await db.query('SELECT * FROM donations');
    console.log('donations:', d.rows);
    const r = await db.query('SELECT * FROM restaurants');
    console.log('restaurants:', r.rows);
    const u = await db.query('SELECT * FROM users');
    console.log('users:', u.rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

test();
