const db = require('../config/db');
const redisClient = require('../config/redis');
const { estimateETA } = require('../utils/scoring');

exports.acceptDelivery = async (req, res) => {
    const { delivery_id, volunteer_id } = req.body;

    try {
        // 1. Use Redis Lock to prevent multiple volunteers from accepting the same delivery
        const lockKey = `lock:delivery:${delivery_id}`;
        const acquired = await redisClient.setnx(lockKey, volunteer_id);
        
        if (!acquired) {
            // Already accepted by someone else
            const currentOwner = await redisClient.get(lockKey);
            if (currentOwner !== String(volunteer_id)) {
                return res.status(409).json({ error: 'Delivery already accepted by another volunteer' });
            }
        }
        
        // 2. Set lock expiry (e.g., 30 mins) to prevent permanent locking
        await redisClient.expire(lockKey, 1800);

        // 3. Update Delivery status in DB
        const result = await db.query(
            `UPDATE deliveries 
             SET volunteer_id = $1, status = 'en_route_pickup', assigned_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND status = 'assigned' RETURNING *`,
            [volunteer_id, delivery_id]
        );

        if (result.rowCount === 0) {
            await redisClient.del(lockKey); // release lock
            return res.status(400).json({ error: 'Delivery not available for acceptance' });
        }

        // Update donation status
        await db.query(`UPDATE donations SET status = 'assigned' WHERE id = $1`, [result.rows[0].donation_id]);

        // Send websocket update (if using io)
        const io = req.app.get('io');
        io.to(`delivery_${delivery_id}`).emit('delivery_accepted', result.rows[0]);

        res.status(200).json({ message: 'Delivery accepted successfully', delivery: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.pickupDelivery = async (req, res) => {
    const { delivery_id, volunteer_id, pickup_photo_url } = req.body;
    try {
        // Validation could be added here to check expiry time against current time + ETA
        
        const result = await db.query(
            `UPDATE deliveries 
             SET status = 'picked_up', pickup_photo_url = $1
             WHERE id = $2 AND volunteer_id = $3 RETURNING *`,
            [pickup_photo_url, delivery_id, volunteer_id]
        );

        if (result.rowCount === 0) return res.status(404).json({ error: 'Delivery not found or unauthorized' });

        await db.query(`UPDATE donations SET status = 'picked_up' WHERE id = $1`, [result.rows[0].donation_id]);

        const io = req.app.get('io');
        io.to(`delivery_${delivery_id}`).emit('delivery_status_update', { status: 'picked_up' });

        res.status(200).json({ message: 'Food picked up', delivery: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.completeDelivery = async (req, res) => {
    const { delivery_id, volunteer_id, delivery_photo_url, notes } = req.body;
    try {
        const result = await db.query(
            `UPDATE deliveries 
             SET status = 'delivered', delivery_photo_url = $1, notes = $2, completed_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND volunteer_id = $4 RETURNING *`,
            [delivery_photo_url, notes, delivery_id, volunteer_id]
        );

        if (result.rowCount === 0) return res.status(404).json({ error: 'Delivery not found or unauthorized' });

        await db.query(`UPDATE donations SET status = 'delivered' WHERE id = $1`, [result.rows[0].donation_id]);

        const io = req.app.get('io');
        io.to(`delivery_${delivery_id}`).emit('delivery_status_update', { status: 'delivered' });

        // release redis lock
        const lockKey = `lock:delivery:${delivery_id}`;
        await redisClient.del(lockKey);

        res.status(200).json({ message: 'Delivery completed', delivery: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
