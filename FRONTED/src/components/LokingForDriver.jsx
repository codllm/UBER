import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RidingContext } from "../context/ridingDataContext";
import socket from "../socket";

const LookingForDriver = () => {

  const navigate = useNavigate();
  const { rideData,setRideData } = useContext(RidingContext);

  const rideId = rideData?._id;

  /* 1️⃣ Debug log */
  useEffect(() => {
    console.log("Ride from context:", rideData);
    console.log("Ride ID:", rideId);
  }, [rideData, rideId]);

  /* 2️⃣ Join ride room */
  useEffect(() => {
    if (!rideId) return;

    console.log("Joining room:", rideId);
    socket.emit("join-ride", rideId.toString());

  }, [rideId]);

  /* 3️⃣ Listen for ride accepted */

useEffect(() => {
  const handleRideAccepted = (data) => {
    setRideData(prev => ({
      ...prev,
      status: data.status,
      caption: data.caption,
      otp: data.otp,   
    }));

    navigate("/user-arriving");
  };

  socket.on("ride-accepted", handleRideAccepted);

  return () => {
    socket.off("ride-accepted", handleRideAccepted);
  };
}, []);

  return (
    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl px-6 py-8 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] z-[70]">
      <div className="flex flex-col items-center justify-center mb-6 relative">
        <div className="absolute w-30 h-30 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

        <img
          src="https://res.cloudinary.com/dju008haw/image/upload/v1770792339/ChatGPT_Image_Feb_11_2026_12_15_23_PM_k5mshs.png"
          alt="driver"
          className="w-28 h-28 rounded-full object-cover"
        />
      </div>

      <h3 className="text-center text-lg font-semibold text-gray-900">
        Looking for a nearby driver...
      </h3>

      <p className="text-center text-sm text-gray-500 mt-2">
        Please wait while we connect you
      </p>
    </div>
  );
};

export default LookingForDriver;