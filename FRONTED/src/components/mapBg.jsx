import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const MapBg = ({ onLocationChange, currentpanel }) => {

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
    { featureType: "poi", stylers: [{ visibility: "on" }] },
  ];

  const mapRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.61,
    lng: 77.21,
  });

  // Get user location as he logins in the app
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(pos);

      });
    }
  }, []);

  // Trigger when map stops moving
  const handleMapIdle = () => {

    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    if (!center) return;

    const lat = center.lat();
    const lng = center.lng();

    console.log("MAP CENTER:", lat, lng);

    if (onLocationChange) {
      onLocationChange({ lat, lng });
    }

  };

  return (
    <div className="relative w-full h-full">

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>

        <GoogleMap
          onLoad={(map) => {
            mapRef.current = map;
          }}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={currentLocation}
          zoom={17}
          options={{
            disableDefaultUI: true,
            clickableIcons: false,
            styles: darkMapStyle,
          }}
          onIdle={handleMapIdle}
        />

      </LoadScript>

      {/* CENTER PIN */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-50 text-center">

        {currentpanel === "location" && (
          <>
            <div className="bg-white px-2 py-1 text-xs font-semibold rounded shadow mb-1">
              Pickup
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="pin"
              className="w-10 h-10 mx-auto"
            />
          </>
        )}

      </div>

    </div>
  );
};

export default MapBg;