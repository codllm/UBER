const rideService = require("../services/ride.service");
const { getFare } = require("../services/ride.service");

const { validationResult } = require("express-validator");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination, vehicleType } = req.body;

    const newRide = await rideService.createRide({
      pickup,
      destination,
      user: req.user._id,
      vehicleType,
    });

    const io = req.app.get("io");

    console.log("username:", req.user.fullname);
    console.log("user emial:", req.user.email);
    console.log("ride info:", newRide);

    io.emit("rideCreated", {
      message: "New ride created!",
      ride: newRide,
      user: {
        fullname: req.user.fullname,
        email: req.user.email
      }
    });

    return res.status(201).json(newRide);
  } catch (err) {
    console.log("CREATE RIDE ERROR:", err);
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
