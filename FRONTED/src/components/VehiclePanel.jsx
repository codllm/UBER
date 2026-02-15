import React from "react";
import axios from "axios";
import { RidingContext } from "../context/ridingDataContext";

const VehiclePanel = ({ Setcurentpanel }) => {

  const { rideData, setRideData } = React.useContext(RidingContext);

  const [fares, setFares] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // 🔥 Fetch all vehicle fares
  React.useEffect(() => {

    const fetchFares = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
          {
            params: {
              pickup: rideData.pickup,
              destination: rideData.destination
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        console.log("FARE RESPONSE:", response.data);

        setFares(response.data.fare);

      } catch (err) {
        console.error("Fare fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (rideData.pickup && rideData.destination) {
      fetchFares();
    }

  }, [rideData.pickup, rideData.destination]);

  // 🔥 Vehicle list (NO hardcoded price)
  const vehicles = [
    {
      id: 1,
      name: "UberGo",
      type: "car",
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82NDkzYzI1NS04N2M4LTRlMmUtOTQyOS1jZjcwOWJmMWI4MzgucG5n",
      desc: "Affordable, compact rides",
      capacity: 4,
    },
    {
      id: 2,
      name: "Moto",
      type: "motorcycle",
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
      desc: "Affordable motorcycle rides",
      capacity: 1,
    },
    {
      id: 3,
      name: "UberAuto",
      type: "auto",
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n",
      desc: "Bargain auto-rickshaw rides",
      capacity: 3,
    },
  ];

  return (
    <div className="w-full bg-white py-2 px-3">

      <h3 className="text-2xl font-semibold mb-5">
        Choose a vehicle
      </h3>

      {vehicles.map((v) => (
        <div
          key={v.id}
          onClick={() => {
            setRideData(prev => ({
              ...prev,
              vehicleType: v.type,
              vehicleName: v.name,
              fare: fares[v.type]
            }));
            Setcurentpanel("confirm");
          }}
          className="flex w-full items-center justify-between p-3 border-2 border-gray-100 active:border-black rounded-xl mb-2 transition-all cursor-pointer"
        >
          {/* Vehicle Image */}
          <img
            className="h-12 w-16 object-contain"
            src={v.image}
            alt={v.name}
          />

          {/* Details */}
          <div className="ml-2 w-1/2">
            <h4 className="font-medium text-base">
              {v.name}
              
            </h4>
            <p className="text-xs text-gray-600">{v.desc}</p>
          </div>

          {/* Dynamic Price */}
          <h2 className="text-lg font-semibold">
            {loading
              ? "..."
              : fares[v.type]
              ? `₹${fares[v.type]}`
              : "--"}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
