import React from "react";
import { ArrowLeft } from "lucide-react";

const ConfirmRide = ({Setcurentpanel}) => {
  return (
    <div className="w-full bg-white rounded-t-3xl p-5 shadow-lg">

      {/* Header with back arrow */}
      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => {Setcurentpanel("vehicle")
           
          }}
        />
        <span className="font-semibold text-sm">
          Looking for nearby drivers
        </span>
      </div>

      <div className="flex justify-center mb-5">
        <img
          className="w-28"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
          alt="car"
        />
      </div>

      <div className="space-y-4 text-sm mb-6">
        <p>📍 Kaikondrahalli, Bengaluru</p>
        <p>🏁 Third Wave Coffee, HSR</p>
      </div>

      <div className="flex justify-between mb-5">
        <span>Trip fare</span>
        <span className="font-semibold">₹193.20</span>
      </div>

      <button className="w-full bg-black text-white py-3 rounded-xl">
        Confirm ride
      </button>
    </div>
  );
};

export default ConfirmRide;
