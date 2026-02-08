const blacklistTokenModel = require('../models/blacklistToken.model');
const captionModel = require('../models/caption.model');

const captionService = require('../services/caption.service')

const {validationResult} = require('express-validator')

module.exports.registerCaption = async (req,res,next)=>{

  const error = validationResult(req);

  console.log(req.body)

  if(!error.isEmpty()){
    return res.status(400).json({error:error.array()});
  }

  const {fullname,email,password,vehicle} = req.body;
  const isCaptionAlredyExists = await captionModel.findOne({
    email
  })
  if(isCaptionAlredyExists){
    return res.status(400).json({message:'caption alredy exits'});
  }

  const hashPassword = await captionModel.hashPassword(password);


  const caption = await captionService.createCaption({
    firstname:fullname.firstname,
    lastname:fullname.lastname,
    email,
    password:hashPassword,
    color:vehicle.color,
    plate:vehicle.plate,
    capacity:vehicle.capacity,
    vehicleType:vehicle.vehicleType
  })

  const token = caption.generateAuthToken();

  res.status(201).
  json({token,caption})
}

module.exports.loginCaption = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { email, password } = req.body;

  const caption = await captionModel.findOne({ email }).select("+password");

  if (!caption) {
    return res.status(401).json({ errors: "Invalid email or password" });
  }

  const isMatch = await caption.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ errors: "Invalid email or password" });
  }

  const token = caption.generateAuthToken();

  res.cookie("token", token);
  res.status(200).json({ token, caption });
};


module.exports.profileCaption =async (req,res,next)=>{
  res.status(200).json({caption:req.caption});
}

module.exports.logoutCaption = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await blacklistTokenModel.create({ token });
  }

  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
};

