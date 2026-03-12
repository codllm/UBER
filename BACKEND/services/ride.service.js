const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");

const captionModel = require('../models/caption.model')

async function getFare(pickup, destination) {
  try {
    const distanceData = await mapService.getDistance(pickup, destination);

    const distanceInKm = distanceData.distanceValue / 1000;
    const durationInMin = distanceData.durationValue / 60;

    const pricing = {
      motorcycle: { baseFare: 20, perKmRate: 5, perMinRate: 1 },
      auto: { baseFare: 30, perKmRate: 8, perMinRate: 2 },
      car: { baseFare: 50, perKmRate: 12, perMinRate: 3 },
    };

    const fares = {};

    for (const type in pricing) {
      const { baseFare, perKmRate, perMinRate } = pricing[type];

      const fare =
        baseFare +
        distanceInKm * perKmRate +
        durationInMin * perMinRate;

      fares[type] = Math.round(fare);
    }

    return fares;

  } catch (error) {
    console.error("Fare calculation error:", error.message);
    throw error;
  }
}




function getOtp() {
  return Math.floor(1000 + Math.random() * 900).toString();
}



async function createRide({
  pickup,
  destination,
  user,
  vehicleType,
  pickupLocation,
  destinationLocation  // ✅ ADD THIS
}) {

  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("Missing required fields");
  }

  const fares = await getFare(pickup, destination);
  const fare = fares[vehicleType];

  const otp = getOtp();

  const newRide = new rideModel({
    user,
    pickup,
    destination,
    vehicleType,
    fare,
    otp,
    status: "pending",
    pickupLocation ,
    destinationLocation  // ✅ SAVE IT IN DB
  });

  return await newRide.save();
}

async function getNearbyCaption( longitude, latitude ) {
  const nearbyCaption = await captionModel.find({
    location: {
      $near: {
        $geometry: {
          type: "Point", 
          coordinates: [longitude, latitude]
        },
        $maxDistance: 3000
      }
    }
  });

  return nearbyCaption;
}


module.exports = {
  getFare,
  createRide,
  getNearbyCaption
};
