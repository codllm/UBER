const captionModel = require('../models/caption.model')

module.exports.createCaption = async ({firstname,lastname,email,password,
  color,plate,capacity,vehicleType

})=>{

  if(!firstname || !email || !password || !plate || !color || !vehicleType || !capacity){
     throw new Error('All feilds are required');
  }

  const caption = captionModel.create({
    fullname:{
      firstname,
      lastname
    },
    email,
    password,
    vehicle:{
      color,
      plate,
      capacity,
      vehicleType
    }
  })
  return caption;
}