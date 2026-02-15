import React, { useState, useEffect, useContext } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CaptionDataContext } from "../context/captionContext";
import { RidingContext } from "../context/ridingDataContext";
import socket from "../socket";
import axios from "axios";

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

 
  useEffect(() => {
    const handleRideCreated = (data) => {
      console.log("Ride event received:", data);

      setRideData(data.ride);

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
    const token = localStorage.getItem("token");

    try {
      const position = await getLocation();

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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-200">

      {/* MAP */}
      <img
        src="https://res.cloudinary.com/dju008haw/image/upload/v1770575345/ChatGPT_Image_Feb_8_2026_11_58_25_PM_s3cmyk.png"
        alt="map"
        className="w-full h-full object-cover"
      />

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

      {/* ================= OFFLINE ================= */}
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

      {/* ================= ONLINE + NO RIDE ================= */}
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

      {/* ================= RIDE REQUEST ================= */}
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
              onClick={() => navigate("captain-arriving")}
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
