import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapBg = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ece75f" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#82C8E5" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
  ];

  
  
  // Get Current Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
      
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          center={currentLocation}
          zoom={13}
          options={{
            styles: darkMapStyle,
            disableDefaultUI: true,

          }}
        >
          <Marker position={currentLocation} />
        </GoogleMap>
      
    </LoadScript>
  );
};

export default MapBg;
