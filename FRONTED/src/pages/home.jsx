import React, { useState, useCallback, useEffect, useContext } from "react";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConformRide";
import LookingForDriver from "../components/LokingForDriver";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";
import { RidingContext } from "../context/ridingDataContext";
import MapBg from "../components/mapBg";

const Home = () => {
  const [sheetPos, setSheetPos] = useState("down");
  const [startY, setStartY] = useState(0);

  const { setRideData } = useContext(RidingContext);

  const [currentpanel, Setcurentpanel] = useState("location");

  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const positions = {
    down: "-65%",
    mid: "-35%",
    up: "-5%",
  };

  const openSheet = () => setSheetPos("up");

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (diff > 50) setSheetPos("up");
    else if (diff < -50) setSheetPos("down");
  };

  /* ================= GET SUGGESTIONS ================= */

  const getsuggestion = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const token = localStorage.getItem("userToken");

    if (!token) {
      console.log("User not authenticated");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuggestions(response.data || []);
    } catch (error) {
      console.log("Suggestion error:", error);
    }
  };

  const debouncedSuggestion = useCallback(
    debounce((value) => {
      getsuggestion(value);
    }, 500),
    []
  );

  useEffect(() => {
    const isrideAvai = localStorage.getItem("currentRide");

    if (isrideAvai) {
      Setcurentpanel("lookingForDriver");
    }
  }, []);

  useEffect(() => {
    return () => {
      debouncedSuggestion.cancel();
    };
  }, [debouncedSuggestion]);

  useEffect(() => {
    if (pickup && destination) {
      const pickupName = typeof pickup === "string" ? pickup : pickup?.name;
      const destinationName =
        typeof destination === "string" ? destination : destination?.name;

      setRideData((prev) => ({
        ...prev,
        pickup: pickupName,
        destination: destinationName,
      }));

      Setcurentpanel("vehicle");
      setSuggestions([]);
    }
  }, [pickup, destination]);

  const fetchAddress = async (coords) => {
    try {
      const token = localStorage.getItem("userToken");

      setPickupInput("Finding location...");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-address`,
        {
          params: { lat: coords.lat, lng: coords.lng },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const address = response.data.address || response.data;

      const addressName = address?.name || address;

      setPickupInput(addressName);
      setPickup(addressName);
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  const debouncedReverseGeocode = useCallback(
    debounce((coords) => {
      fetchAddress(coords);
    }, 700),
    []
  );

  useEffect(() => {
    return () => {
      debouncedReverseGeocode.cancel();
    };
  }, [debouncedReverseGeocode]);

  const handleMapMove = (coords) => {
    if (activeField === "pickup" || activeField === null) {
      debouncedReverseGeocode(coords);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0f172a] text-white font-sans">

      {/* LOGO */}

      <div className="absolute top-6 left-6 z-20">
        <div className="bg-[#121b2d]/90 backdrop-blur-md p-3 rounded-2xl font-extrabold shadow-xl border border-white/5">
        GoIndia
        </div>
      </div>

      {/* MAP */}

      <div className="w-full h-full">
        <MapBg onLocationChange={handleMapMove} currentpanel={currentpanel} />
      </div>

      {/* BOTTOM SHEET */}

      {currentpanel !== "confirm" && currentpanel !== "lookingForDriver" && (
        <div
          style={{ bottom: positions[sheetPos] }}
          className="absolute left-0 w-full h-[90%] bg-[#121b2d]/95 backdrop-blur-2xl rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 transition-all duration-500 z-30"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-600 rounded-full opacity-40"></div>
          </div>

          <div className="px-6 py-4">

            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">
              Where to?
              {currentpanel !== "location" && (
                <ArrowLeft
                  className="float-end cursor-pointer"
                  onClick={() => Setcurentpanel("location")}
                />
              )}
            </h2>

            <div className="flex items-start gap-4 relative">

              <div className="flex flex-col items-center mt-6">

                <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-[#121b2d] z-10"></div>

                <div className="w-[2px] h-14 border-l-2 border-dashed border-gray-600 my-1"></div>

                <div className="w-3 h-3 bg-green-400 rounded-full z-10"></div>

              </div>

              <div className="flex-1 space-y-3">

                {/* PICKUP */}

                <input
                  value={pickupInput}
                  onFocus={() => {
                    openSheet();
                    setActiveField("pickup");
                  }}
                  onChange={(e) => {
                    setPickupInput(e.target.value);
                    debouncedSuggestion(e.target.value);
                  }}
                  placeholder="Current Location"
                  className="w-full bg-[#1c2943] border border-white/5 p-4 rounded-xl text-white placeholder-gray-400"
                />

                {/* DESTINATION */}

                <input
                  value={destinationInput}
                  onFocus={() => {
                    openSheet();
                    setActiveField("destination");
                  }}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    debouncedSuggestion(e.target.value);
                  }}
                  placeholder="Enter destination"
                  className="w-full bg-[#1c2943] border border-white/5 p-4 rounded-xl text-white placeholder-gray-400"
                />

              </div>

            </div>

          </div>

          {currentpanel === "location" && (
            <LocationSearchPanel
              suggestions={suggestions}
              activeField={activeField}
              setPickup={setPickup}
              setDestination={setDestination}
              setPickupInput={setPickupInput}
              setDestinationInput={setDestinationInput}
            />
          )}

        </div>
      )}

      {currentpanel === "vehicle" && (
        <div className="absolute inset-x-0 bottom-0 z-[60]">
          <VehiclePanel Setcurentpanel={Setcurentpanel} />
        </div>
      )}

      {currentpanel === "confirm" && (
        <div className="absolute inset-x-0 bottom-0 z-[60]">
          <ConfirmRide Setcurentpanel={Setcurentpanel} />
        </div>
      )}

      {currentpanel === "lookingForDriver" && (
        <div className="absolute inset-x-0 bottom-0 z-[60]">
          <LookingForDriver />
        </div>
      )}

    </div>
  );
};

export default Home;
