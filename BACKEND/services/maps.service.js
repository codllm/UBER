const axios = require("axios");

module.exports.getAddressCoordinates = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: apiKey,
        },
      }
    );

    if (response.data.status !== "OK") {
      throw new Error(response.data.status);
    }

    const location = response.data.results[0].geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng,
    };
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    throw error;
  }
};

module.exports.getDistance = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: origin,
          destinations: destination,
          key: apiKey,
        },
      }
    );

    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];























































































































































      
      return {
        distanceText: element.distance.text,
        distanceValue: element.distance.value, // meters
        durationText: element.duration.text,
        durationValue: element.duration.value, // seconds
      };
    } else {
      throw new Error("Distance Matrix failed");
    }
  } catch (error) {
    console.error("Distance Matrix Error:", error.message);
    throw error;
  }
};

module.exports.getSuggestions = async (input) => {
  const apiKey = process.env.GOOGLE_MAPS_API;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: input,
          key: apiKey,
        },
      }
    );
    console.log(response.data);

    if (response.data.status === "OK") {
      return response.data.predictions.map(
        (prediction) => prediction.description
      );
    } else {
      throw new Error("Place Autocomplete failed");
    }
  } catch (error) {
    console.error("Place Autocomplete Error:", error.message);
    throw error;
  }
};
