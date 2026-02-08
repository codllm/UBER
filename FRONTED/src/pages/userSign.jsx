
import { UserDataContext } from "../context/userContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";

const UserSign = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(UserDataContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;

        setUser(data.user);

        localStorage.setItem("token", data.token);
        //navigate to homePage
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

      {/* Form */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Create your account
        </h1>

        {/* First Name */}
        <input
          type="text"
          placeholder="First name"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4 outline-none"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        {/* Last Name */}
        <input
          type="text"
          placeholder="Last name"
          className="w-full bg-gray-100 px-4 py-4 rounded-lg mb-4 outline-none"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

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

        {/* Sign up Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-lg text-lg hover:bg-gray-900 transition"
        >
          Create account
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/user-login")}
            className="text-black font-semibold cursor-pointer"
          >
            Sign in
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Captain Signup */}
        <button
          onClick={() => navigate("/caption-sign")}
          className="w-full bg-gray-100 py-4 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Sign up as Captain
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-sm text-gray-500 text-center">
        By signing up, you agree to Uber’s Terms & Privacy Policy.
      </div>
    </div>
  );
};

export default UserSign;
