import React from "react";
import { ArrowLeft } from "lucide-react";
import { RidingContext } from "../context/ridingDataContext";
import axios from "axios";

const ConfirmRide = ({ Setcurentpanel }) => {
  const { rideData, setRideData } = React.useContext(RidingContext);

  const createRide = async () => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: rideData.pickup,
          destination: rideData.destination,
          vehicleType: rideData.vehicleType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        const newRide = response.data;

        localStorage.setItem("currentRide", newRide._id);
        setRideData(newRide);

        Setcurentpanel("lookingForDriver");
      }

    } catch (err) {
      console.error("Error creating ride:", err);
    }
  };

  return (
    <div className="w-full bg-[#121b2d]/95 backdrop-blur-xl border-t border-white/5 rounded-t-[40px] px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] text-white">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <button
          onClick={() => { Setcurentpanel("vehicle") }}
          className="p-2 rounded-full bg-[#1c2943] hover:bg-[#243457] transition"
        >
          <ArrowLeft className="text-white" />
        </button>

        <h3 className="text-sm font-semibold text-gray-300">
          Confirm your ride
        </h3>

        <div className="w-8" />

      </div>

      {/* Vehicle Illustration */}

      <div className="flex justify-center mb-6">

        <img
          className="w-36 drop-shadow-lg"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
          alt="car"
        />

      </div>

      {/* Route Info */}

      <div className="space-y-4 text-sm mb-6">

        <div className="flex items-start gap-3">

          <span className="mt-1 text-blue-400">📍</span>

          <span className="text-gray-200">
            {rideData.pickup}
          </span>

        </div>

        <div className="flex items-start gap-3">

          <span className="mt-1 text-green-400">🏁</span>

          <span className="text-gray-200">
            {rideData.destination}
          </span>

        </div>

      </div>

      <div className="h-px bg-white/10 mb-6" />

      {/* Fare */}

      <div className="flex justify-between items-center mb-6">

        <span className="text-sm text-gray-400">
          Trip fare
        </span>

        <span className="text-xl font-bold text-white">
          ₹{rideData.fare}
        </span>

      </div>

      {/* Confirm Button */}

      <button
        className="w-full bg-white text-black py-4 rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
        onClick={createRide}
      >
        Confirm Ride
      </button>

    </div>
  );
};

export default ConfirmRide;
