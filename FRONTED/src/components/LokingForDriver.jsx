import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RidingContext } from "../context/ridingDataContext";
import socket from "../socket";
import axios from "axios";

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

    const fetchRideDetails = async () => {
  
      const currentRideId = localStorage.getItem("currentRide");
      if (!currentRideId) return;
  
      try {
  
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/details-by-id/user?rideId=${currentRideId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
        );
  
        setRideData({
          ...res.data,
          captain: res.data.caption
        });
  
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchRideDetails();
  
  
    const handleRideAccepted = (data) => {
  
      setRideData(prev => ({
        ...prev,
        status: data.status,
        captain: data.caption, // rename here
        otp: data.otp
      }));
  
      navigate("/user-arriving");
    };
  
    socket.on("ride-accepted", handleRideAccepted);
  
    return () => {
      socket.off("ride-accepted", handleRideAccepted);
    };
  
  }, []);

  const [count, setCount] = React.useState(120);

  useEffect(() => {
  
    const timer = setInterval(() => {
  
      setCount((prev) => {
  
        if (prev === 1) {
          clearInterval(timer);

          axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel`, {
            rideId:localStorage.getItem("currentRide"),
          }
          , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          })
          localStorage.removeItem("currentRide");
          navigate("/home");
          window.location.reload();
        }
  
        return prev - 1;
  
      });
  
    }, 1000);
  
    return () => clearInterval(timer);
  
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

      <p className="text-center text-sm text-gray-600 mt-2">
        Please wait while we connect you <span className="ml-2">{count}s</span>
      </p>
    </div>
  );
};

export default LookingForDriver;