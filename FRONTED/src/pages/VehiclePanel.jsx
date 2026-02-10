import React from "react";
import { ArrowLeft } from "lucide-react";

const VehiclePanel = ({ Setcurentpanel }) => {
  const vehicles = [
    {
      id: 1,
      name: "UberGo",
      image:
        "https://res.cloudinary.com/dazyc9p6r/image/upload/v1707562000/uber-car_p9z3oa.png",
      price: "₹193.20",
      time: "2 mins away • 15:24",
      desc: "Affordable, compact rides",
      capacity: 4,
    },
    {
      id: 2,
      name: "Moto",
      image:
        "https://res.cloudinary.com/dazyc9p6r/image/upload/v1707562000/uber-moto_q8n3ob.png",
      price: "₹65.17",
      time: "3 mins away • 15:24",
      desc: "Affordable motorcycle rides",
      capacity: 1,
    },
    {
      id: 3,
      name: "UberAuto",
      image:
        "https://res.cloudinary.com/dazyc9p6r/image/upload/v1707562000/uber-auto_k9m4pc.png",
      price: "₹118.21",
      time: "4 mins away • 15:25",
      desc: "Bargain auto-rickshaw rides",
      capacity: 3,
    },
  ];

  return (
    <div className="w-full bg-white py-2 px-3">
      
      {/* Header with Close Down Arrow */}
      <h5 className="p-1 text-center w-[93%] absolute top-0 text-gray-400">
        <i className="ri-arrow-down-s-line text-3xl"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5"> Choose a vehicle  </h3> 
     

      {vehicles.map((v) => (
        <div
          key={v.id}
          onClick={() => Setcurentpanel("confirm")}
          className="flex w-full items-center justify-between p-3 border-2 border-gray-100 active:border-black rounded-xl mb-2 transition-all"
        >
          {/* Vehicle Image */}
          <img
            className="h-12 w-16 object-contain"
            src={v.image}
            alt={v.name}
          />

          {/* Vehicle Details */}
          <div className="ml-2 w-1/2">
            <h4 className="font-medium text-base">
              {v.name}{" "}
              <span className="text-xs ml-1">
                <i className="ri-user-3-fill"></i>
                {v.capacity}
              </span>
            </h4>
            <h5 className="font-medium text-sm">{v.time}</h5>
            <p className="font-normal text-xs text-gray-600">{v.desc}</p>
          </div>

          {/* Price */}
          <h2 className="text-lg font-semibold">{v.price}</h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
