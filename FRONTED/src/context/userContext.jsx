import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setUser(response.data);

      } catch (err) {
        console.error("Error fetching user profile:", err.message);

        // 🔥 Optional: If token invalid, remove it
        if (err.response?.status === 401) {
          localStorage.removeItem("userToken");
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContextProvider;
