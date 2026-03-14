import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const MapBg = ({ onLocationChange, currentpanel }) => {

  const premiumDarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b4b4b" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#383838" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  ];

  const mapRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.61,
    lng: 77.21,
  });

  // Get user location when app loads
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
            styles: premiumDarkStyle,
          }}
          onIdle={handleMapIdle}
        />

      </LoadScript>

      {/* CENTER PIN */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-50 text-center">

        {currentpanel === "location" && (
          <div className="flex flex-col items-center">

            {/* Glass pickup label */}

            <div className="bg-[#121b2d]/90 backdrop-blur-md border border-white/10 text-white px-3 py-1 text-xs font-semibold rounded-lg shadow-lg mb-2">
              Pickup
            </div>

            {/* Pin */}

            <div className="relative">

              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="pin"
                className="w-10 h-10 drop-shadow-lg"
              />

              {/* Pulse ring */}

              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default MapBg;
