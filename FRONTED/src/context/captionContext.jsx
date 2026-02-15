import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CaptionDataContext = createContext(null);

const CaptionContextProvider = ({ children }) => {
  const [caption, setCaption] = useState(null);

  useEffect(() => {
    const fetchCaptainProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captions/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 🔥 IMPORTANT — no nesting
        setCaption(response.data);

      } catch (error) {
        console.log("Profile fetch error:", error.message);
      }
    };

    fetchCaptainProfile();
  }, []);

  return (
    <CaptionDataContext.Provider value={{ caption, setCaption }}>
      {children}
    </CaptionDataContext.Provider>
  );
};

export default CaptionContextProvider;
