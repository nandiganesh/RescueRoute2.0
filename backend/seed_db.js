require('dotenv').config();
const db = require('./config/db');

async function run() {
  try {
    console.log('--- Starting Production Database Seed ---');
    
    // 1. Ensure a restaurant exists for ID 1
    await db.query(`INSERT INTO users (id, name, email, role) VALUES (1, 'Fresh Bakes', 'fresh@bakes.com', 'restaurant') ON CONFLICT (id) DO NOTHING`);
    await db.query(`INSERT INTO restaurants (user_id, lat, lng) VALUES (1, 17.385, 78.4867) ON CONFLICT (user_id) DO NOTHING`);

    // 2. Insert donations
    await db.query(`INSERT INTO donations (restaurant_id, food_details, quantity, expiry_time, status) VALUES (1, 'Fresh Biryani', 15, NOW() + interval '2 hours', 'available')`);
    await db.query(`INSERT INTO donations (restaurant_id, food_details, quantity, expiry_time, status) VALUES (1, 'Vegetable Pulao', 10, NOW() + interval '3 hours', 'available')`);
    
    console.log('✅ Successfully seeded Postgres with Available Donations!');
    
    // 3. Verify
    const res = await db.query('SELECT * FROM donations WHERE status = \'available\'');
    console.log('📊 Total available donations in DB:', res.rowCount);
    
  } catch (e) {
    console.error('❌ Seeding failed:', e.message);
  } finally {
    process.exit();
  }
}

run();
