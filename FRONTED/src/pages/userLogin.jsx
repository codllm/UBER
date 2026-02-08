import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = { email, password };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );
  
      const data = response.data;
  
      if (response.status === 200) {
        setUser(data.user);
        console.log("You are logged in");

        localStorage.setItem("token", data.token);
        
        navigate("/home");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
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

      {/* Top Section */}
      <div className="px-6 pt-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          What's your email and password?
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="your@gmail.com"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="••••••••"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-6 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-lg text-lg hover:bg-gray-900 transition"
        >
          Continue
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New to Uber?{" "}
          <span
            onClick={() => navigate("/user-sign")}
            className="text-black font-semibold cursor-pointer"
          >
            Create an account
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Captain Login Button */}
        <button
          onClick={() => navigate("/caption-login")}
          className="w-full bg-gray-100 py-4 rounded-lg mb-3 font-medium hover:bg-gray-200 transition"
        >
          Continue as Captain
        </button>

        {/* Social Login */}
        <button className="w-full bg-gray-100 py-4 rounded-lg font-medium">
          Continue with Google
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-sm text-gray-500 text-center">
        By continuing, you agree to Uber’s Terms & Privacy Policy.
      </div>
    </div>
  );
};

export default UserLogin;
