import React, { useState, useEffect, useContext } from "react";
import { Phone } from "lucide-react";
import { RidingContext } from "../context/ridingDataContext";
import { CaptionDataContext } from "../context/captionContext";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import socket from "../socket";

const CaptainArriving = () => {
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
  const { rideData } = useContext(RidingContext);
  const { caption } = useContext(CaptionDataContext);

  const [captainLocation, setCaptainLocation] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // ================= JOIN RIDE ROOM =================
  useEffect(() => {
    if (rideData?._id) {
      socket.emit("join-ride", rideData._id);
    }
  }, [rideData]);

  // ================= SEND LIVE LOCATION =================
  useEffect(() => {

    let interval;

    if (rideData?._id && caption?.caption?._id) {

      interval = setInterval(() => {

        navigator.geolocation.getCurrentPosition((position) => {

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setCaptainLocation({ lat, lng });

          socket.emit("captain-location-update", {
            rideId: rideData._id,
            latitude: lat,
            longitude: lng,
          });

        });

      }, 3000);
    }

    return () => clearInterval(interval);

  }, [rideData, caption]);

  const pickupLocation = rideData?.pickupLocation
    ? {
        lat: rideData.pickupLocation.latitude,
        lng: rideData.pickupLocation.longitude,
      }
    : null;

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="relative w-screen h-screen">

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={14}
        center={pickupLocation || captainLocation}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,

        }}
      >
        {pickupLocation && <Marker position={pickupLocation} />}

        {captainLocation && (
          <Marker
            position={captainLocation}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
      </GoogleMap>

      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl px-6 py-6 shadow-lg">
        <h3 className="text font-light mb-4">
          Navigate to Pickup Location
        </h3>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-extrabold capitalize">
              {rideData?.user?.fullname?.firstname}
            </p>
          </div>
          <Phone size={20} />
        </div>

        <div className="flex items-start gap-2 text-sm">
          <span>📍</span>
          <span>{rideData?.pickup}</span>
        </div>
      </div>

    </div>
  );
};

export default CaptainArriving;