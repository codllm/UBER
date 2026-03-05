const rideModel = require("../models/ride.model");
const rideService = require("../services/ride.service");
const { getFare } = require("../services/ride.service");
const mapService = require("../services/maps.service");

const { validationResult } = require("express-validator");
const { compareSync } = require("bcrypt");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("error in validator while creating the ride");
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination, vehicleType } = req.body;

    // ✅ Get pickup coordinates
    const pickupCoords = await mapService.getAddressCoordinates(pickup);

    console.log(
      "Pickup coordinates:",
      pickupCoords.longitude,
      pickupCoords.latitude
    );

    // ✅ Create ride properly
    const newRide = await rideService.createRide({
      pickup: pickup, // keep address string
      destination,
      user: req.user._id,
      vehicleType,
      pickupLocation: {
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
      },
    });

    // ✅ Find nearby captains
    const getnearbyCaption = await rideService.getNearbyCaption(
      pickupCoords.longitude,
      pickupCoords.latitude
    );



    const io = req.app.get("io");

    // ✅ Emit ride with pickupLocation included
    getnearbyCaption.forEach((caption) => {
      if (caption.socketId) {
        io.to(caption.socketId).emit("rideCreated", {
          ride: newRide,
          user: {
            fullname: req.user.fullname,
            email: req.user.email,
          },
          caption,
        });
      }
    });

    return res.status(201).json(newRide);

  } catch (err) {
    console.log("CREATE RIDE ERROR:", err);
    return res.status(400).json({ message: err.message });
  }
};

module.exports.acceptRide = async (req, res) => {

  const { rideID } = req.body;

  try {
    let ride = await rideModel.findById(rideID);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = "accepted";
    ride.caption = req.caption._id;   // ✅ FIXED FIELD NAME
    await ride.save();

    // 🔥 Populate caption
    ride = await rideModel
      .findById(rideID)
      .populate("caption");

    const io = req.app.get("io");

    io.to(rideID.toString()).emit("ride-accepted", {
      rideId: rideID,
      status: "accepted",
      caption: ride.caption   // ✅ send caption
    });

    return res.status(200).json({ message: "Ride accepted successfully" });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.getfare = async (req, res) => {
  const { pickup, destination } = req.query;
  try {
    const fare = await getFare(pickup, destination);
    return res.status(200).json({ fare });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
