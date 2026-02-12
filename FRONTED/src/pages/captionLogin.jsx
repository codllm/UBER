import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptionDataContext } from "../context/captionContext";

const CaptainLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { caption, setCaption } = React.useContext(CaptionDataContext);

  const handleSubmit =async(e) => {
    e.preventDefault();

    const captionData = {
      email,
      password,
    };

    try{
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captions/login`, captionData);

      if(response.status === 200){
        const data = response.data;
    
        localStorage.setItem("token", data.token);
        setCaption(data.caption);
    
        navigate("/caption-home");
    }
    
  }catch(error){
    console.error("Login error:", error.response ? error.response.data : error.message);
    alert("Login failed. Please check your credentials and try again.");
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
      <div className="px-6 pt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Sign in as Captain
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-6 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-lg text-lg hover:bg-gray-900 transition"
        >
          Continue
        </button>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New captain?{" "}
          <span
            onClick={() => navigate("/caption-sign")}
            className="text-black font-semibold cursor-pointer"
          >
            Register here
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Switch to User Login */}
        <button
          onClick={() => navigate("/user-login")}
          className="w-full bg-gray-100 py-4 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Continue as User
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-sm text-gray-500 text-center">
        By continuing, you agree to Uber’s Captain Terms.
      </div>
    </div>
  );
};

export default CaptainLogin;
