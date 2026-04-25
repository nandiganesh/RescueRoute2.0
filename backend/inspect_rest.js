require('dotenv').config();
const db = require('./config/db');

async function run() {
  try {
    const res = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'restaurants'`);
    console.log('Restaurants columns:', res.rows.map(r => r.column_name));
  } catch (e) {
    console.error(e.message);
  } finally {
    process.exit();
  }
}
run();
