const db = require('../config/db');
const matchingService = require('../services/matchingService');

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
