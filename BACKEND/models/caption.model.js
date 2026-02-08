const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const captionSchema = new mongoose.Schema({

  fullname:{
    firstname:{
    type:String,
    required:true,
    minlength:[3,'firstname must be at least 3 charec long']
  },
  lastname:{
    type:String,
    minlength:[3,'lastname must be at 3 charec long']
  }
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    require:true,
    select:false
  },
  socketId:{
    type:String
  },
  status:{
    type:String,
    enum:["active","inactive"],
    default:'inactive'
  },
  vehicle:{
    color:{
      type:String,
      required:true,
      minlength:[3,'color must be atleast 3 charec long']
    },
    plate:{
      type:String,
      required:true,
      minlength:[3,'plate must be at least 3 charec long']
    },
    capacity:{
      type:Number,
      required:true,
      minlength:[1,'capacity must be at least 1']
    },
    vehicleType:{
      type:String,
      required:true,
      enum:['car','motorcycle','auto']
    }
  },
  location:{
    lat:{
      type:Number
    },
    lng:{
      type:String

    }
  }
});

captionSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
};
captionSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captionSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};


const captionModel = mongoose.model('caption',captionSchema);

module.exports = captionModel;