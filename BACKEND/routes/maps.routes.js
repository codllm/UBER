const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const mapController = require('../controllers/map.controller');
// this routes gives the corrdinates of the address provided in the query parameter, 
//it is protected by auth middleware, so only authenticated users can access it
router.get('/coordinates', auth.authUser, mapController.getCoordinates);

// this routes will give the distance bw to postion and time need to to cover distance

router.get('/distance', auth.authUser, mapController.getDistance);

router.get('/get-suggestions', auth.authUser, mapController.getSuggestions);

module.exports = router;
