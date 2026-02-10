import React, { useState } from "react";
import LocationSearchPanel from "./LocationSearchPanel";
import VehiclePanel from "./VehiclePanel";
import ConfirmRide from "./ConformRide";
import { ArrowLeft } from "lucide-react";

const Home = () => {
  const [sheetPos, setSheetPos] = useState("down");
  const [startY, setStartY] = useState(0);

  // ✅ SINGLE SOURCE OF TRUTH
  const [currentpanel, Setcurentpanel] = useState("location");
  const [panel, Setpanel] = useState(true);

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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-200 font-sans">
      {/* Uber Logo */}
      <div className="absolute top-10 left-6 z-20 p-2 bg-white rounded-full shadow-lg">
        <img
          className="w-8"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber"
        />
      </div>

      {/* Map */}
      <img
        className="w-full h-full object-cover"
        src="https://res.cloudinary.com/dju008haw/image/upload/v1770575345/ChatGPT_Image_Feb_8_2026_11_58_25_PM_s3cmyk.png"
        alt="map"
      />

      {/* Bottom Sheet */}
      {currentpanel!="confirm" && (
        <div
          style={{ bottom: positions[sheetPos] }}
          className="absolute left-0 w-full h-[90%] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-30"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
          </div>

          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 tracking-tight">
              Where to?
              {currentpanel !== "location" && (
                <ArrowLeft
                  className="float-end cursor-pointer"
                  onClick={() => Setcurentpanel("location")}
                />
              )}
            </h2>

            {/* Location Inputs */}
            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center mt-6">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white z-10"></div>
                <div className="w-[2px] h-14 border-l-2 border-dotted border-gray-300 my-1"></div>
                <div className="w-2.5 h-2.5 bg-black z-10"></div>
              </div>

              <div className="flex-1 space-y-3">
                <input
                  onFocus={openSheet}
                  placeholder="Current Location"
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl"
                />

                <input
                  onFocus={openSheet}
                  placeholder="Enter destination"
                  className="w-full bg-gray-100 border border-gray-100 p-4 rounded-xl"
                />
              </div>
            </div>
          </div>

          {currentpanel === "location" && (
            <LocationSearchPanel Setcurentpanel={Setcurentpanel} />
          )}
        </div>
      )}

      {/* Overlays */}
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
    </div>
  );
};

export default Home;
