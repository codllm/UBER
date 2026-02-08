import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptionDataContext } from "../context/captionContext";
import axios from "axios";

const CaptainSign = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    color: "",
    plate: "",
    capacity: "",
    vehicleType: "car",
  });

  const {caption, setCaption} = React.useContext(CaptionDataContext);

  const handleChange =async(e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit =async(e) => {
    e.preventDefault();

    const captainData = {
      fullname: {
        firstname: formData.firstname,
        lastname: formData.lastname,
      },
      email: formData.email,
      password: formData.password,
      vehicle: {
        color: formData.color,
        plate: formData.plate,
        capacity: Number(formData.capacity),
        vehicleType: formData.vehicleType,
      },
    };

    try{
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captions/register`, captainData);

    if(response.status === 201){
      const data = response.data;

      setCaption(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/caption-home");

    }
    console.log("Response from backend:", response.status);
    // later: send to backend
  }catch(error){
    console.error("Error during registration:", error.response ? error.response.data : error.message);
  }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col justify-between">

      {/* Header */}
      <div className="w-full flex justify-center py-6">
        <span className="text-[22px] font-bold tracking-tight text-black">
          UBER
        </span>
      </div>

      {/* Form */}
      <div className="px-6 pt-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Sign up as Captain
        </h1>

        {/* First Name */}
        <input
          name="firstname"
          placeholder="First name"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.firstname}
          onChange={handleChange}
        />

        {/* Last Name */}
        <input
          name="lastname"
          placeholder="Last name"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.lastname}
          onChange={handleChange}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Vehicle Color */}
        <input
          name="color"
          placeholder="Vehicle color"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.color}
          onChange={handleChange}
        />

        {/* Vehicle Plate */}
        <input
          name="plate"
          placeholder="Vehicle plate number"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.plate}
          onChange={handleChange}
        />

        {/* Vehicle Capacity */}
        <input
          type="number"
          name="capacity"
          placeholder="Vehicle capacity"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4"
          value={formData.capacity}
          onChange={handleChange}
        />

        {/* Vehicle Type */}
        <select
          name="vehicleType"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-6"
          value={formData.vehicleType}
          onChange={handleChange}
        >
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="auto">Auto</option>
        </select>

        {/* Sign up Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-lg text-lg"
        >
          Register as Captain
        </button>

        {/* Switch to login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already a captain?{" "}
          <span
            onClick={() => navigate("/caption-login")}
            className="text-black font-semibold cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-sm text-gray-500 text-center">
        By continuing, you agree to Uber’s Captain Terms.
      </div>
    </div>
  );
};

export default CaptainSign;
