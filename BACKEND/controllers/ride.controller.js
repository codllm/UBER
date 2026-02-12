const { model } = require("mongoose");
const rideService = require("../services/ride.service");

const {validationResult} = require('express-validator');

module.exports.createRide = async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  try{
    const {pickup, destination,vehicleType} = req.body;

    const newRide = await rideService.createRide({pickup, destination,user:req.user._id,vehicleType});
    return res.status(201).json(newRide);
  }catch(err){
    return res.status(400).json({message: err.message});
  }

}