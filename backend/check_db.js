const db = require('./config/db');
async function run() {
  const users = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['users']);
  const rests = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['restaurants']);
  console.log('users table:', users.rows.map(r => r.column_name));
  console.log('restaurants table:', rests.rows.map(r => r.column_name));
  process.exit(0);
}
run();
