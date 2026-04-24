const express = require('express');
const router = express.Router();

const donationController = require('../controllers/donationController');
const deliveryController = require('../controllers/deliveryController');
const locationController = require('../controllers/locationController');

// Donations
router.get('/donations/active', donationController.getActiveDonations);
router.get('/donations/nearby', donationController.getNearbyDonations);
router.post('/donations', donationController.createDonation);

// Volunteers
router.get('/volunteers/nearby', locationController.getNearbyVolunteers);

// Deliveries
router.post('/deliveries/accept', deliveryController.acceptDelivery);
router.post('/deliveries/pickup', deliveryController.pickupDelivery);
router.post('/deliveries/complete', deliveryController.completeDelivery);

// Location
router.post('/location/update', locationController.updateLocation);

module.exports = router;
