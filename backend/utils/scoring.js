/**
 * Calculate volunteer match score
 * score = (distance_weight * distance) + (expiry_weight * urgency) - (rating_weight * reliability)
 * Note: Lower score is better (we sort ascending) if distance is penalizing.
 * Wait, in the prompt: score = (distance_weight * distance) * (expiry_weight * urgency) - (rating_weight * reliability)
 * Let's implement based on prompt: "score = (distance_weight * distance) + (expiry_weight * urgency) - (rating_weight * reliability)"
 * Actually prompt says: 
 * score =
 * (distance_weight * distance)
 * * (expiry_weight * urgency)
 * - (rating_weight * reliability)
 * 
 * We want the best volunteer.
 */
function calculateMatchScore(distanceKm, expiryTimeMs, rating) {
    const DISTANCE_WEIGHT = 1.5;
    const URGENCY_WEIGHT = 0.5;
    const RATING_WEIGHT = 2.0;
    
    // Urgency is inversely proportional to time left. Less time = higher urgency.
    const timeLeftMs = expiryTimeMs - Date.now();
    const hoursLeft = Math.max(timeLeftMs / (1000 * 60 * 60), 0.1); // Avoid div by 0
    const urgency = 1 / hoursLeft;
    
    // The prompt specified formula
    const score = (DISTANCE_WEIGHT * distanceKm) * (URGENCY_WEIGHT * urgency) - (RATING_WEIGHT * rating);
    return score;
}

/**
 * Predict shelter demand using simple moving average
 * @param {number[]} historicalDeliveries Array of past delivery quantities 
 */
function predictDemand(historicalDeliveries) {
    if (!historicalDeliveries || historicalDeliveries.length === 0) return 0;
    const sum = historicalDeliveries.reduce((a, b) => a + b, 0);
    return sum / historicalDeliveries.length;
}

/**
 * ETA Estimation
 * @param {number} distanceKm 
 * @param {number} avgSpeedKmh 
 * @returns {number} ETA in minutes
 */
function estimateETA(distanceKm, avgSpeedKmh = 30) {
    return (distanceKm / avgSpeedKmh) * 60;
}

module.exports = { calculateMatchScore, predictDemand, estimateETA };
