const db = require('../config/db');
const { calculateDistance } = require('../utils/haversine');

exports.updateLocation = async (req, res) => {
    const { volunteer_id, lat, lng } = req.body;
    try {
        await db.query(
            `UPDATE volunteers SET last_lat = $1, last_lng = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3`,
            [lat, lng, volunteer_id]
        );
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update location' });
    }
};

exports.getNearbyVolunteers = async (req, res) => {
    const { lat, lng, radius_km = 5 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

    try {
        // Get active volunteers
        const result = await db.query(`SELECT user_id, last_lat, last_lng, rating FROM volunteers WHERE is_active = true`);
        
        const nearby = result.rows.filter(vol => {
            if (!vol.last_lat || !vol.last_lng) return false;
            const dist = calculateDistance(lat, lng, vol.last_lat, vol.last_lng);
            return dist <= radius_km;
        });

        res.status(200).json({ volunteers: nearby });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get nearby volunteers' });
    }
};
