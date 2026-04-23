const { Worker } = require('bullmq');
const redisClient = require('../config/redis');
const { performMatching, queueMatchingJob } = require('../services/matchingService');
const db = require('../config/db');

console.log('Worker started: Listening for matching jobs...');

const matchingWorker = new Worker('matchingQueue', async job => {
    const { donationId, radiusKm, attempt } = job.data;
    console.log(`Processing matching job for Donation ${donationId}, radius ${radiusKm}km (attempt ${attempt})`);
    
    try {
        const topVolunteers = await performMatching(donationId, radiusKm);
        
        if (topVolunteers === null) {
            // Expired
            return;
        }

        if (topVolunteers.length === 0) {
            console.log(`No volunteers found within ${radiusKm}km.`);
            // Failure handling: retry with larger radius if attempt < 3
            if (attempt < 3) {
                const newRadius = radiusKm + 5; // Expand radius by 5km
                console.log(`Retrying with larger radius: ${newRadius}km`);
                await queueMatchingJob(donationId, newRadius, attempt + 1);
            } else {
                console.log(`Max attempts reached for donation ${donationId}. No volunteers available.`);
                // Could mark donation as failed or notify restaurant
            }
        } else {
            console.log(`Successfully matched and notified ${topVolunteers.length} volunteers.`);
        }

    } catch (error) {
        console.error(`Error processing job for Donation ${donationId}:`, error);
        throw error; // Let bullmq handle retry
    }
}, { connection: redisClient });

matchingWorker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
});

matchingWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error ${err.message}`);
});
