const mapService = require('../services/maps.service');

module.exports.getCoordinates = async (req, res, next) => {
  const addresh = req.query.address;

  if (!addresh) {
    return res.status(400).json({ error: 'Address query parameter is required' });
  }

  try {
    const coordinates = await mapService.getAddressCoordinates(addresh);

    return res.json(coordinates);

  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
};


module.exports.getDistance = async (req, res, next) => {

  const {origin, destination} = req.query;

  try{
    const distance = await mapService.getDistance(origin, destination);
    return res.json({distance});
  }catch(err){
    console.error("Error fetching distance:", err.message);
    return res.status(500).json({error:'Failed to fetch distance'})
  }
  
}

module.exports.getSuggestions = async (req, res) => {
  const input = req.query.input;

  if (!input) {
    return res.status(400).json({
      error: "Input query parameter is required"
    });
  }

  try {
    const suggestions = await mapService.getSuggestions(input);
    return res.status(200).json(suggestions);

  } catch (err) {
    console.error("Error fetching suggestions:", err.message);
    return res.status(500).json({
      error: "Failed to fetch suggestions"
    });
  }
};
