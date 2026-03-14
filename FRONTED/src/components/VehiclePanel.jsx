import React from "react";
import axios from "axios";
import { RidingContext } from "../context/ridingDataContext";

const VehiclePanel = ({ Setcurentpanel }) => {

  const { rideData, setRideData } = React.useContext(RidingContext);

  const [fares, setFares] = React.useState({});
  const [loading, setLoading] = React.useState(false);

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
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
        );

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
    <div className="w-full bg-[#121b2d]/95 backdrop-blur-xl border-t border-white/5 rounded-t-[40px] px-5 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] text-white">

      <h3 className="text-2xl font-semibold mb-6">
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
          className="flex w-full items-center justify-between p-4 bg-[#1c2943] border border-white/5 hover:border-white/20 rounded-2xl mb-3 transition-all cursor-pointer"
        >

          <img
            className="h-12 w-16 object-contain"
            src={v.image}
            alt={v.name}
          />

          <div className="ml-3 w-1/2">

            <h4 className="font-semibold text-base">
              {v.name}
            </h4>

            <p className="text-xs text-gray-400">
              {v.desc}
            </p>

          </div>

          <h2 className="text-lg font-bold">

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
