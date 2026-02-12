import React from "react";
// made for the user when he is waiting for the driver to accept his ride request and the app is looking for nearby drivers
const LookingForDriver = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl px-6 py-8 shadow-[0_-10px_30px_rgba(0,0,0,0.15)] z-[70]">

      {/* Driver Image with Spinner */}
      <div className="flex flex-col items-center justify-center mb-6 relative">
        
        {/* Black rotating circle */}
        <div className="absolute w-30 h-30 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

        {/* Driver image */}
        <img
         src="https://res.cloudinary.com/dju008haw/image/upload/v1770792339/ChatGPT_Image_Feb_11_2026_12_15_23_PM_k5mshs.png"
          alt="driver"
          className="w-28 h-28 rounded-full object-cover"
        />
      </div>

      {/* Text */}
      <h3 className="text-center text-lg font-semibold text-gray-900">
        Looking for a nearby driver...
      </h3>

      <p className="text-center text-sm text-gray-500 mt-2">
        Please wait while we connect you
      </p>
    </div>
  );
};

export default LookingForDriver;
