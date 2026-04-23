/**
 * Database Config
 * In demo mode (no DATABASE_URL), uses an in-memory mock.
 * In production, connects to PostgreSQL via Supabase.
 */

const DEMO_MODE = !process.env.DATABASE_URL;

if (DEMO_MODE) {
  console.log('⚠️  DEMO MODE: Using in-memory database (no PostgreSQL)');
}

// --- In-memory tables for demo mode ---
const tables = {
  users: [
    { id: 1, name: 'Fresh Bakes Restaurant', email: 'fresh@bakes.com', phone: '555-0001', role: 'restaurant', created_at: new Date() },
    { id: 2, name: 'John Doe', email: 'john@volunteer.com', phone: '555-0002', role: 'volunteer', created_at: new Date() },
    { id: 3, name: 'Jane Smith', email: 'jane@volunteer.com', phone: '555-0003', role: 'volunteer', created_at: new Date() },
    { id: 4, name: 'City Shelter', email: 'city@shelter.com', phone: '555-0004', role: 'shelter', created_at: new Date() },
    { id: 5, name: 'Mike Wilson', email: 'mike@volunteer.com', phone: '555-0005', role: 'volunteer', created_at: new Date() },
  ],
  restaurants: [
    { user_id: 1, address: '123 Main St', lat: 17.385, lng: 78.4867 },
  ],
  volunteers: [
    { user_id: 2, rating: 4.8, total_deliveries: 42, is_active: true, last_lat: 17.390, last_lng: 78.490, fcm_token: null, updated_at: new Date() },
    { user_id: 3, rating: 4.5, total_deliveries: 28, is_active: true, last_lat: 17.388, last_lng: 78.492, fcm_token: null, updated_at: new Date() },
    { user_id: 5, rating: 4.9, total_deliveries: 65, is_active: true, last_lat: 17.392, last_lng: 78.485, fcm_token: null, updated_at: new Date() },
  ],
  shelters: [
    { user_id: 4, address: '456 Shelter Rd', lat: 17.375, lng: 78.480, capacity: 100, demand_score: 0 },
  ],
  donations: [],
  deliveries: [],
  notifications: [],
};

let autoId = { donations: 1, deliveries: 1, notifications: 1 };

/**
 * Minimal SQL-like query parser for demo mode.
 * Supports INSERT...RETURNING, UPDATE...RETURNING, SELECT, and basic WHERE.
 */
function mockQuery(text, params = []) {
  const sql = text.trim().toUpperCase();

  // --- INSERT ---
  if (sql.startsWith('INSERT INTO DONATIONS')) {
    const d = { id: autoId.donations++, restaurant_id: params[0], food_details: params[1], quantity: params[2], expiry_time: params[3], status: 'available', created_at: new Date() };
    tables.donations.push(d);
    return { rows: [d], rowCount: 1 };
  }
  if (sql.startsWith('INSERT INTO DELIVERIES')) {
    const d = { id: autoId.deliveries++, donation_id: params[0], volunteer_id: null, shelter_id: params[1], status: 'assigned', pickup_photo_url: null, delivery_photo_url: null, notes: null, assigned_at: new Date(), completed_at: null };
    tables.deliveries.push(d);
    return { rows: [d], rowCount: 1 };
  }
  if (sql.startsWith('INSERT INTO NOTIFICATIONS')) {
    const n = { id: autoId.notifications++, user_id: params[0], title: params[1], body: params[2], is_read: false, created_at: new Date() };
    tables.notifications.push(n);
    return { rows: [n], rowCount: 1 };
  }

  // --- UPDATE ---
  if (sql.includes('UPDATE DELIVERIES') && sql.includes("STATUS = 'EN_ROUTE_PICKUP'")) {
    const del = tables.deliveries.find(d => d.id === params[1] && d.status === 'assigned');
    if (del) { del.volunteer_id = params[0]; del.status = 'en_route_pickup'; del.assigned_at = new Date(); return { rows: [del], rowCount: 1 }; }
    return { rows: [], rowCount: 0 };
  }
  if (sql.includes('UPDATE DELIVERIES') && sql.includes("STATUS = 'PICKED_UP'")) {
    const del = tables.deliveries.find(d => d.id === params[1] && d.volunteer_id === params[2]);
    if (del) { del.status = 'picked_up'; del.pickup_photo_url = params[0]; return { rows: [del], rowCount: 1 }; }
    return { rows: [], rowCount: 0 };
  }
  if (sql.includes('UPDATE DELIVERIES') && sql.includes("STATUS = 'DELIVERED'")) {
    const del = tables.deliveries.find(d => d.id === params[2] && d.volunteer_id === params[3]);
    if (del) { del.status = 'delivered'; del.delivery_photo_url = params[0]; del.notes = params[1]; del.completed_at = new Date(); return { rows: [del], rowCount: 1 }; }
    return { rows: [], rowCount: 0 };
  }
  if (sql.includes('UPDATE DONATIONS') && sql.includes("STATUS = 'ASSIGNED'")) {
    const don = tables.donations.find(d => d.id === params[0]);
    if (don) don.status = 'assigned';
    return { rows: [], rowCount: don ? 1 : 0 };
  }
  if (sql.includes('UPDATE DONATIONS') && sql.includes("STATUS = 'PICKED_UP'")) {
    const don = tables.donations.find(d => d.id === params[0]);
    if (don) don.status = 'picked_up';
    return { rows: [], rowCount: don ? 1 : 0 };
  }
  if (sql.includes('UPDATE DONATIONS') && sql.includes("STATUS = 'DELIVERED'")) {
    const don = tables.donations.find(d => d.id === params[0]);
    if (don) don.status = 'delivered';
    return { rows: [], rowCount: don ? 1 : 0 };
  }
  if (sql.includes('UPDATE DONATIONS') && sql.includes("STATUS = 'EXPIRED'")) {
    const don = tables.donations.find(d => d.id === params[0]);
    if (don) don.status = 'expired';
    return { rows: [], rowCount: don ? 1 : 0 };
  }
  if (sql.includes('UPDATE VOLUNTEERS')) {
    const vol = tables.volunteers.find(v => v.user_id === params[2]);
    if (vol) { vol.last_lat = params[0]; vol.last_lng = params[1]; vol.updated_at = new Date(); }
    return { rows: [], rowCount: vol ? 1 : 0 };
  }

  // --- SELECT ---
  if (sql.includes('FROM DONATIONS') && sql.includes('JOIN RESTAURANTS')) {
    const don = tables.donations.find(d => d.id === params[0]);
    if (!don) return { rows: [], rowCount: 0 };
    const rest = tables.restaurants.find(r => r.user_id === don.restaurant_id);
    return { rows: [{ ...don, lat: rest?.lat, lng: rest?.lng }], rowCount: 1 };
  }
  if (sql.includes('FROM VOLUNTEERS') && sql.includes('IS_ACTIVE')) {
    return { rows: tables.volunteers.filter(v => v.is_active), rowCount: tables.volunteers.filter(v => v.is_active).length };
  }
  if (sql.includes('FROM SHELTERS')) {
    if (tables.shelters.length > 0) return { rows: [tables.shelters[0]], rowCount: 1 };
    return { rows: [], rowCount: 0 };
  }

  // Fallback
  return { rows: [], rowCount: 0 };
}

// --- Exports ---
let realPool = null;
if (!DEMO_MODE) {
  const { Pool } = require('pg');
  realPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
}

module.exports = {
  query: (text, params) => {
    if (DEMO_MODE) return Promise.resolve(mockQuery(text, params));
    return realPool.query(text, params);
  },
  DEMO_MODE,
  _tables: tables, // exposed for debug endpoints
};
