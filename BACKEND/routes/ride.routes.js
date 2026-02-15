const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');
const { body } = require('express-validator');
const { model } = require('mongoose');
const { response } = require('../app');

router.post('/create', auth.authUser, [
  body('pickup').notEmpty().withMessage('Pickup location is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required')
], rideController.createRide);

router.get('/get-fare', auth.authUser, rideController.getfare);

module.exports = router;