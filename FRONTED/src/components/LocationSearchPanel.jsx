import React from "react";
import { MapPin } from "lucide-react";
import { RidingContext } from "../context/ridingDataContext";

const LocationSearchPanel = ({
  suggestions,
  activeField,
  setPickup,
  setDestination,
  setPickupInput,
  setDestinationInput,
}) => {
  const { rideData, SetrideData } = React.useContext(RidingContext);
  return (
    <div className="w-full bg-white px-4 py-3">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">
        Suggested locations
      </h3>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {suggestions?.length === 0 && (
          <div className="text-gray-400 text-sm text-center py-6">
            Start typing to see suggestions
          </div>
        )}

        {suggestions?.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (activeField === "pickup") {
                setPickup(item);
                setPickupInput(item);
              } else {
                setDestination(item);
                setDestinationInput(item);
              }
            }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
              <MapPin size={18} />
            </div>

            <div className="flex flex-col">
              <span className="text-sm  text-gray-900">
                {item}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
