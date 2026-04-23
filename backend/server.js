const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const routes = require('./routes');
const db = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({
        name: 'RescueRoute API',
        version: '3.0',
        status: 'running',
        mode: db.DEMO_MODE ? 'demo (in-memory)' : 'production (PostgreSQL)',
        endpoints: [
            'POST /api/donations',
            'GET  /api/volunteers/nearby',
            'POST /api/deliveries/accept',
            'POST /api/deliveries/pickup',
            'POST /api/deliveries/complete',
            'POST /api/location/update',
        ],
    });
});

// Debug endpoint — only in demo mode
if (db.DEMO_MODE) {
    app.get('/api/debug/state', (req, res) => {
        res.json(db._tables);
    });
}

// API Routes
app.use('/api', routes);

// WebSockets for Real-time location and status updates
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join_delivery', (deliveryId) => {
        socket.join(`delivery_${deliveryId}`);
        console.log(`Joined room delivery_${deliveryId}`);
    });

    socket.on('update_location', async (data) => {
        if (data.deliveryId) {
            io.to(`delivery_${data.deliveryId}`).emit('location_updated', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Set IO instance globally
app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 RescueRoute Backend running on http://localhost:${PORT}`);
    console.log(`   Mode: ${db.DEMO_MODE ? '⚠️  DEMO (in-memory data)' : '✅ Production (PostgreSQL + Redis)'}`);
    console.log(`\n📋 Try these commands:`);
    console.log(`   curl http://localhost:${PORT}/`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/donations -H "Content-Type: application/json" -d "{\\"restaurant_id\\":1,\\"food_details\\":\\"20 sandwiches\\",\\"quantity\\":20,\\"expiry_time\\":\\"2026-04-24T00:00:00Z\\"}"`);
    console.log(`   curl http://localhost:${PORT}/api/volunteers/nearby?lat=17.385&lng=78.487`);
    if (db.DEMO_MODE) console.log(`   curl http://localhost:${PORT}/api/debug/state`);
    console.log('');
});
