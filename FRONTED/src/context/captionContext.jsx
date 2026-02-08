import { createContext, useState } from "react";

export const CaptionDataContext = createContext(null);

const CaptionContextProvider = ({ children }) => {
  const [caption, setCaption] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
    vehicle: {
      color: "",
      plate: "",
      capacity: "",
      vehicleType: "",
    },
  });

  return (
    <CaptionDataContext.Provider value={{ caption, setCaption }}>
      {children}
    </CaptionDataContext.Provider>
  );
};

export default CaptionContextProvider;
