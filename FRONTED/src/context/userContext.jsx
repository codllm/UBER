import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
  });

  useEffect(() => {
    const userProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) return; // important

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    userProfile(); 

  }, []);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContextProvider;
