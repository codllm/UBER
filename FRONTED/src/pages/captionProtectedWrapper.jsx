import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CaptionDataContext } from "../context/captionContext";
import axios from "axios";

const CaptionProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { setCaption } = useContext(CaptionDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/caption-login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captions/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCaption(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching captain profile:", error);
        localStorage.removeItem("token");
        navigate("/caption-login");
      });

  }, [navigate, setCaption]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return children;
};

export default CaptionProtectWrapper;
