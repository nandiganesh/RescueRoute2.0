const db = require('../config/db');
const matchingService = require('../services/matchingService');

const { calculateDistance } = require('../utils/haversine');

exports.getActiveDonations = async (req, res) => {
    try {
        if (db.DEMO_MODE) {
            const donations = db._tables.donations.filter(d => d.status !== 'expired');
            return res.json(donations);
        }
        const result = await db.query(
            `SELECT * FROM donations WHERE status != 'expired' ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
};

exports.getNearbyDonations = async (req, res) => {
    const { lat, lng, radius_km = 10 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

    try {
        let availableDonations = [];

        if (db.DEMO_MODE) {
            availableDonations = db._tables.donations
                .filter(d => d.status === 'available')
                .map(d => {
                    const rest = db._tables.restaurants.find(r => r.user_id === d.restaurant_id);
                    const delivery = db._tables.deliveries.find(del => del.donation_id === d.id && del.status === 'assigned');
                    return { 
                        ...d, 
                        restaurant_name: rest?.name || 'Restaurant', 
                        lat: rest?.lat, 
                        lng: rest?.lng,
                        delivery_id: delivery?.id
                    };
                });
        } else {
            const result = await db.query(
                `SELECT d.*, u.name as restaurant_name, r.lat, r.lng, del.id as delivery_id
                 FROM donations d 
                 JOIN restaurants r ON d.restaurant_id = r.user_id 
                 JOIN users u ON r.user_id = u.id
                 LEFT JOIN deliveries del ON d.id = del.donation_id AND del.status = 'assigned'
                 WHERE d.status = 'available'`
            );
            availableDonations = result.rows;
        }

        const nearby = availableDonations.filter(don => {
            if (!don.lat || !don.lng) return false;
            const dist = calculateDistance(lat, lng, don.lat, don.lng);
            don.distance = dist.toFixed(1) + ' km';
            return dist <= radius_km;
        });

        res.json(nearby);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch nearby donations' });
    }
};

exports.createDonation = async (req, res) => {
    const { restaurant_id, food_details, quantity, expiry_time } = req.body;

    try {
        // 1. Create Donation
        const result = await db.query(
            `INSERT INTO donations (restaurant_id, food_details, quantity, expiry_time)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [restaurant_id, food_details, quantity, expiry_time]
        );
        
        const donation = result.rows[0];

        // 2. Trigger Matching Job
        await matchingService.queueMatchingJob(donation.id);

        res.status(201).json({ message: 'Donation created and matching started', donation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create donation' });
    }
};
