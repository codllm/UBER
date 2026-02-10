import React from "react";
import { ArrowLeft } from "lucide-react";

const ConfirmRide = ({ Setcurentpanel }) => {
  return (
    <div className="w-full bg-white rounded-t-3xl px-6 py-5 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => Setcurentpanel("vehicle")}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
        >
          <ArrowLeft className="text-gray-900" />
        </button>

        <h3 className="text-sm font-semibold text-gray-800">
          Looking for nearby drivers
        </h3>

        {/* spacer for symmetry */}
        <div className="w-8" />
      </div>

      {/* Vehicle Illustration */}
      <div className="flex justify-center mb-6">
        <img
          className="w-32"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
          alt="car"
        />
      </div>

      {/* Route Info */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex items-start gap-3">
          <span className="mt-1 text-gray-500">📍</span>
          <span className="text-gray-800 font-medium">
            Kaikondrahalli, Bengaluru
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="mt-1 text-gray-500">🏁</span>
          <span className="text-gray-800 font-medium">
            Third Wave Coffee, HSR
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-5" />

      {/* Fare */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-600">Trip fare</span>
        <span className="text-lg font-semibold text-gray-900">
          ₹193.20
        </span>
      </div>

      {/* Confirm Button */}
      <button className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 active:scale-[0.98] transition">
        Confirm ride
      </button>
    </div>
  );
};

export default ConfirmRide;
