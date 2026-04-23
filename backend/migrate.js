/**
 * Database Migration + Seed Script
 * Runs the SQL schema on Supabase and seeds demo data.
 */
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const client = await pool.connect();
  console.log('✅ Connected to Supabase PostgreSQL');

  try {
    // Drop existing tables (clean slate)
    console.log('\n🗑️  Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS deliveries CASCADE;
      DROP TABLE IF EXISTS donations CASCADE;
      DROP TABLE IF EXISTS shelters CASCADE;
      DROP TABLE IF EXISTS restaurants CASCADE;
      DROP TABLE IF EXISTS volunteers CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // Create tables
    console.log('📦 Creating tables...');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) CHECK (role IN ('restaurant', 'volunteer', 'shelter')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✓ users');

    await client.query(`
      CREATE TABLE volunteers (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        rating DECIMAL(3,2) DEFAULT 5.00,
        total_deliveries INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT false,
        last_lat DECIMAL(10,8),
        last_lng DECIMAL(10,8),
        fcm_token TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_volunteer_location ON volunteers(last_lat, last_lng);
    `);
    console.log('   ✓ volunteers');

    await client.query(`
      CREATE TABLE restaurants (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        address TEXT,
        lat DECIMAL(10,8),
        lng DECIMAL(10,8)
      );
    `);
    console.log('   ✓ restaurants');

    await client.query(`
      CREATE TABLE shelters (
        user_id INTEGER PRIMARY KEY REFERENCES users(id),
        address TEXT,
        lat DECIMAL(10,8),
        lng DECIMAL(10,8),
        capacity INTEGER,
        demand_score DECIMAL(5,2) DEFAULT 0
      );
    `);
    console.log('   ✓ shelters');

    await client.query(`
      CREATE TABLE donations (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(user_id),
        food_details TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        expiry_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'picked_up', 'delivered', 'expired', 'failed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_donation_status ON donations(status);
    `);
    console.log('   ✓ donations');

    await client.query(`
      CREATE TABLE deliveries (
        id SERIAL PRIMARY KEY,
        donation_id INTEGER REFERENCES donations(id),
        volunteer_id INTEGER REFERENCES volunteers(user_id),
        shelter_id INTEGER REFERENCES shelters(user_id),
        status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'en_route_pickup', 'picked_up', 'delivering', 'delivered', 'failed')),
        pickup_photo_url TEXT,
        delivery_photo_url TEXT,
        notes TEXT,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);
    console.log('   ✓ deliveries');

    await client.query(`
      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255),
        body TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('   ✓ notifications');

    // Seed data
    console.log('\n🌱 Seeding demo data...');

    await client.query(`
      INSERT INTO users (name, email, phone, role) VALUES
        ('Fresh Bakes Restaurant', 'fresh@bakes.com', '555-0001', 'restaurant'),
        ('John Doe', 'john@volunteer.com', '555-0002', 'volunteer'),
        ('Jane Smith', 'jane@volunteer.com', '555-0003', 'volunteer'),
        ('City Shelter', 'city@shelter.com', '555-0004', 'shelter'),
        ('Mike Wilson', 'mike@volunteer.com', '555-0005', 'volunteer'),
        ('Spice Garden', 'spice@garden.com', '555-0006', 'restaurant'),
        ('Hope House Shelter', 'hope@house.com', '555-0007', 'shelter');
    `);
    console.log('   ✓ 7 users seeded');

    await client.query(`
      INSERT INTO restaurants (user_id, address, lat, lng) VALUES
        (1, '123 Main St, Hyderabad', 17.385000, 78.486700),
        (6, '456 Spice Rd, Hyderabad', 17.395000, 78.475000);
    `);
    console.log('   ✓ 2 restaurants seeded');

    await client.query(`
      INSERT INTO volunteers (user_id, rating, total_deliveries, is_active, last_lat, last_lng) VALUES
        (2, 4.80, 42, true, 17.390000, 78.490000),
        (3, 4.50, 28, true, 17.388000, 78.492000),
        (5, 4.90, 65, true, 17.392000, 78.485000);
    `);
    console.log('   ✓ 3 volunteers seeded');

    await client.query(`
      INSERT INTO shelters (user_id, address, lat, lng, capacity) VALUES
        (4, '789 Shelter Rd, Hyderabad', 17.375000, 78.480000, 100),
        (7, '101 Hope Ave, Hyderabad', 17.400000, 78.470000, 75);
    `);
    console.log('   ✓ 2 shelters seeded');

    console.log('\n🎉 Migration complete! Database is ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(() => process.exit(1));
