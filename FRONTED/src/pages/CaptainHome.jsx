import React, { useState, useEffect, useContext } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CaptionDataContext } from "../context/captionContext";
import { RidingContext } from "../context/ridingDataContext";
import socket from "../socket";
import axios from "axios";
import MapBg from "../components/mapBg";

const CaptainHome = () => {
  const [online, setOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(false);

  const navigate = useNavigate();

  const { rideData, setRideData } = useContext(RidingContext);
  const { caption } = useContext(CaptionDataContext);

  const [userData, setUserData] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
  });

  /* =========================================
     ✅ REGISTER CAPTAIN SOCKET (ADDED FIX)
  ========================================= */
  useEffect(() => {
    if (caption?.caption?._id) {
      socket.emit("register-captain", caption.caption._id);
      console.log("Captain registered with socket:", caption.caption._id);
    }
  }, [caption]);

  /* =========================================
     🎯 LISTEN FOR RIDE EVENT
  ========================================= */
  useEffect(() => {
    const handleRideCreated = (data) => {
      console.log("Ride event received:", data);
 
    
      setRideData({
        ...data.ride,
        user: data.user,
        caption:data.caption,
      });

      setUserData({
        email: data.user.email,
        fullname: {
          firstname: data.user.fullname.firstname,
          lastname: data.user.fullname.lastname,
        },
      });

      setRideRequest(true);
    };

    socket.on("rideCreated", handleRideCreated);

    return () => {
      socket.off("rideCreated", handleRideCreated);
    };
  }, []);

  /* =========================================
     📍 GET LOCATION
  ========================================= */
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { enableHighAccuracy: true }
      );
    });
  };

  const captionOnlineLocation = async () => {
    console.log("Updating location for captain... captionOnlineLocation call the function");
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const position = await getLocation();
      console.log("Location obtained:", position);

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captions/update-location`,
        { latitude, longitude },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Location updated successfully");
      }
    } catch (err) {
      console.error("Error updating location:", err);
    }
  };

  useEffect(() => {
    if (online) {
      captionOnlineLocation();
    }
  }, [online]);


  const saveRideAccepted = async () => {

      const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }
    localStorage.setItem("currentRide", rideData?._id); // ✅ THIS MUST BE STRING 
  
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/rides/accept`,
        {
          rideID: rideData?._id   // ✅ THIS MUST BE STRING
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("API Response:", res.data);
  
    } catch (err) {
      console.error("Accept error:", err.response?.data || err.message);
    }
  };
  useEffect(() => {

    const handleRideCancelled = (data) => {
  
      if (data.rideId === rideData?._id) {
  
        setRideData(null);
        navigate("/captain-home");
  
      }
  
    };
  
    socket.on("ride-cancelled", handleRideCancelled);
  
    return () => {
      socket.off("ride-cancelled", handleRideCancelled);
    };
  
  }, [rideData]);
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-200">

      <MapBg />

      {/* ONLINE TOGGLE */}
      <div className="absolute top-10 right-6 bg-white px-5 py-2 rounded-full shadow-lg">
        <button
          onClick={() => setOnline((prev) => !prev)}
          className={`font-semibold ${
            online ? "text-green-600" : "text-gray-600"
          }`}
        >
          {online ? "Online" : "Offline"}
        </button>
      </div>

      {/* OFFLINE */}
      {!online && (
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg px-6 py-8">
          <h3 className="text-lg font-semibold mb-3">You're Offline</h3>
          <p className="text-sm text-gray-500 mb-6">
            Go online to start receiving ride requests.
          </p>
          <button
            onClick={() => setOnline(true)}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold"
          >
            Go Online
          </button>
        </div>
      )}

      {/* ONLINE + NO RIDE */}
      {online && !rideRequest && (
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold capitalize">
              {caption?.caption?.fullname?.firstname?.charAt(0) || "D"}
            </div>

            <div>
              <h3 className="text-lg font-semibold capitalize">
                {caption?.caption?.fullname?.firstname || "Driver Name"}
              </h3>
              <p className="text-sm text-gray-500">
                {caption?.caption?.vehicle?.plate || "Vehicle Number"}
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Waiting for ride requests...
          </div>
        </div>
      )}

      {/* RIDE REQUEST */}
      {online && rideRequest && (
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg px-6 py-6">
          <h3 className="text-lg font-semibold mb-4">New Ride Request</h3>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="user"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold capitalize">
                  {userData?.fullname?.firstname}{" "}
                  {userData?.fullname?.lastname}
                </p>
                <p className="text-xs text-gray-500">4.8 ⭐</p>
              </div>
            </div>
            <Phone size={20} />
          </div>

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

          <div className="flex justify-between mb-6">
            <span className="text-sm text-gray-600">Estimated Fare</span>
            <span className="font-semibold text-lg">
              ₹{rideData?.fare}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setRideRequest(false)}
              className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold"
            >
              Ignore
            </button>

            <button
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold"
              onClick={async () => {
                await saveRideAccepted();
                navigate("/captain-arriving");
              }}

            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainHome;