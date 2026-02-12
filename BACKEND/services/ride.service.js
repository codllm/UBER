const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
async function getFare(pickup, destination, vehicleType) {
  try {
    const distanceData = await mapService.getDistance(pickup, destination);

    const distanceInKm = distanceData.distanceValue / 1000; // meters → km
    const durationInMin = distanceData.durationValue / 60; // seconds → minutes

    let baseFare, perKmRate, perMinRate;

    switch (vehicleType) {
      case "motorcycle":
        baseFare = 20;
        perKmRate = 5;
        perMinRate = 1;
        break;

      case "auto":
        baseFare = 30;
        perKmRate = 8;
        perMinRate = 2;
        break;

      case "car":
        baseFare = 50;
        perKmRate = 12;
        perMinRate = 3;
        break;

      default:
        throw new Error("Invalid vehicle type");
    }

    const fare =
      baseFare + distanceInKm * perKmRate + durationInMin * perMinRate;

    return Math.round(fare);
  } catch (error) {
    console.error("Fare calculation error:", error.message);
    throw error;
  }
}
function getOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}


module.exports.createRide = async ({
  pickup,
  destination,
  user,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("Missing required fields");
  }

  const fare = await getFare(pickup, destination, vehicleType);
  const otp = getOtp();

  const newRide = new rideModel({ user, pickup, destination, fare,otp });
  return await newRide.save();
};
