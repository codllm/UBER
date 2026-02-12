import React, { useState } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CaptainHome = () => {
  const [online, setOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(false);
  const navigate = useNavigate();

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
          onClick={() => setOnline(!online)}
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

          <h3 className="text-lg font-semibold mb-6">
            This Month Overview
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-500">Total Earnings</p>
              <p className="text-lg font-semibold">₹18,450</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-500">Total Trips</p>
              <p className="text-lg font-semibold">132</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-500">Avg Rating</p>
              <p className="text-lg font-semibold">4.8 ⭐</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-500">Online Hours</p>
              <p className="text-lg font-semibold">96h</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Waiting for ride requests...
          </div>

          {/* Simulate Ride Button (remove later) */}
          <button
            onClick={() => setRideRequest(true)}
            className="mt-4 text-blue-600 underline text-sm"
          >
            Simulate Ride Request
          </button>

        </div>
      )}

      {/* ================= RIDE REQUEST ================= */}
      {online && rideRequest && (
        <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] px-6 py-6">

          <h3 className="text-lg font-semibold mb-4">
            New Ride Request
          </h3>

          {/* USER INFO */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="user"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">Rahul Sharma</p>
                <p className="text-xs text-gray-500">4.8 ⭐</p>
              </div>
            </div>
            <Phone size={20} />
          </div>

          {/* ROUTE */}
          <div className="space-y-3 text-sm mb-5">
            <div className="flex gap-2">
              <span>📍</span>
              <span>HSR Layout, Bangalore</span>
            </div>
            <div className="flex gap-2">
              <span>🏁</span>
              <span>Koramangala, Bangalore</span>
            </div>
          </div>

          {/* FARE */}
          <div className="flex justify-between mb-6">
            <span className="text-sm text-gray-600">
              Estimated Fare
            </span>
            <span className="font-semibold text-lg">
              ₹240
            </span>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={() => setRideRequest(false)}
              className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold"
            >
              Ignore
            </button>

            <button
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold"
              onClick={()=>navigate('captain-arriving')}
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
