const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'caption'
  },
  pickup:{
    type: String,
    required: true
  },
  destination:{
    type: String,
    required: true
  },
  fare:{
    type: Number,
    required: true
  },
  status:{
    type: String,
    enum: ['pending', 'accepted','ongoing','completed', 'cancelled'],
    default: 'pending'
  },
  duration:{
    type: Number
  },
  distance:{
    type: Number
  },
  paymentID:{
    type: String
  },
  orderId:{
    type: String
  },
  signature:{
    type: String
  },
  otp:{
    type: String,
    required: true,
    select:false

  },
  pickupLocation: {
    latitude: Number,
    longitude: Number,
  },
});

module.exports = mongoose.model('ride', rideSchema);