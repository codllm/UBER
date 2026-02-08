const express = require("express");
const { model } = require("mongoose");

const { validationResult, body } = require("express-validator");
const router = express.Router();
const captionContoller = require("../controllers/caption.controller");
const { authcaption } = require("../middleware/auth.middleware");



router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),

    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("firstname must be 3 char long"),

    body("password")
      .isLength({ min: 3 })
      .withMessage("password must be 3 char long"),

    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("color must be 3 char long"),

    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("plate number must be 3 char long"),

    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("capacity must be at least 1"),

    body("vehicle.vehicleType")
      .isIn(["car", "auto", "motorcycle"])
      .withMessage("Invalid vehicle type"),
  ],
  captionContoller.registerCaption
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("password must be 3 char long"),
  ],
  captionContoller.loginCaption
);

router.get('/profile',authcaption,captionContoller.profileCaption)


router.get('/logout',authcaption,captionContoller.logoutCaption)

module.exports = router;
