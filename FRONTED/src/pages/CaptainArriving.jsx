import React, { useState } from "react";
import { Phone } from "lucide-react";
// this for the caption when he is arriving to the user and asking for the otp to start the ride
const CaptainArriving = () => {
  const [askOtp, setAskOtp] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-200">

      {/* MAP WITH ROUTE */}
      <img
        src="https://res.cloudinary.com/dju008haw/image/upload/v1770575345/ChatGPT_Image_Feb_8_2026_11_58_25_PM_s3cmyk.png"
        alt="map"
        className="w-full h-full object-cover"
      />

      {/* ETA Bubble */}
      <div className="absolute top-10 left-6 bg-white px-4 py-2 rounded-full shadow-md">
        <span className="text-sm font-semibold">5 mins away</span>
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] px-6 py-6">

        {!askOtp ? (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Navigate to Pickup Location
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

            {/* Pickup Location */}
            <div className="flex items-start gap-2 mb-6 text-sm">
              <span>📍</span>
              <span>HSR Layout, Bangalore</span>
            </div>

            {/* Button */}
            <button
              onClick={() => setAskOtp(true)}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold"
            >
              Reached User
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Enter Ride OTP
            </h3>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
              className="w-full bg-gray-100 p-4 rounded-xl mb-4 outline-none text-center text-lg tracking-widest"
            />

            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
              Start Ride
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default CaptainArriving;
