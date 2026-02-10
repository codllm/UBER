import React from "react";
import { MapPin, Home, Briefcase } from "lucide-react";

const LocationSearchPanel = ({ Setcurentpanel }) => {
  const locations = [
    {
      id: 1,
      title: "Home",
      address: "123 Tech Avenue, Silicon Valley",
      icon: <Home size={18} />,
    },
    {
      id: 2,
      title: "Office",
      address: "456 Innovation Way, San Francisco",
      icon: <Briefcase size={18} />,
    },
    {
      id: 3,
      title: "Central Station",
      address: "Downtown Transit Hub",
      icon: <MapPin size={18} />,
    },
  ];

  return (
    <div className="w-full bg-white px-4 py-3">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">
        Recent locations
      </h3>

      <div className="space-y-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => {console.log("clicked"); Setcurentpanel("vehicle")}}
            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
              {loc.icon}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {loc.title}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[220px]">
                {loc.address}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
