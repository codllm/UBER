import React, { useEffect, useState, useContext } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { RidingContext } from "../context/ridingDataContext";
import { Phone } from "lucide-react";
import socket from "../socket";

const UserArriving = () => {
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

  const [captainLocation, setCaptainLocation] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // ================= JOIN ROOM =================
  useEffect(() => {
    if (!rideData?._id) return;
    socket.emit("join-ride", rideData._id);
  }, [rideData]);

  // ================= RECEIVE LOCATION =================
  useEffect(() => {

    const handleLocation = (data) => {
      setCaptainLocation({
        lat: data.latitude,
        lng: data.longitude,
      });
    };

    socket.on("captain-location", handleLocation);

    return () => socket.off("captain-location", handleLocation);

  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  const pickupLocation = rideData?.pickupLocation
    ? {
        lat: rideData.pickupLocation.latitude,
        lng: rideData.pickupLocation.longitude,
      }
    : null;

  return (
    <div className="relative w-screen h-screen">

      {/* ================= MAP ================= */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={14}
        center={captainLocation || pickupLocation}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,

        }}
      >

        {/* Pickup Marker */}
        {pickupLocation && (
          <Marker position={pickupLocation} />
        )}

        {/* Captain Moving Icon */}
        {captainLocation && (
          <Marker
            position={captainLocation}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {/* Route Line */}
        {pickupLocation && captainLocation && (
          <Polyline
            path={[captainLocation, pickupLocation]}
            options={{
              strokeColor: "#000000",
              strokeWeight: 4,
            }}
          />
        )}

      </GoogleMap>

      {/* ================= BOTTOM PANEL ================= */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg px-6 py-6">

        <h3 className="text-lg font-semibold mb-4">
          Captain is arriving 🚗
        </h3>

        {/* Driver Info */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="captain"
              className="w-14 h-14 rounded-full"
            />
            <div>
              <p className="font-semibold capitalize">
                {rideData?.caption?.fullname?.firstname}
              </p>
              <p className="text-sm text-gray-500">
                {rideData?.caption?.vehicle?.plate}
              </p>
            </div>
          </div>

          <Phone size={22} />
        </div>

        {/* Route Info */}
        <div className="space-y-3 text-sm mb-5">
          <div className="flex gap-2">
            <span>📍</span>
            <span>{rideData?.pickup}</span>
          </div>

          <div className="flex gap-2">
            <span>🏁</span>
            <span>{rideData?.destination}</span>
          </div>
        </div>

        {/* Fare */}
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Fare</span>
          <span className="font-semibold text-lg">
            ₹{rideData?.fare}
          </span>
        </div>
        <div>
          <span>{rideData?.otp}</span>
        </div>

      </div>
    </div>
  );
};

export default UserArriving;