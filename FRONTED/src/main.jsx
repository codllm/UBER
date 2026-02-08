import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import CaptionContextProvider from "./context/captionContext";
import UserContextProvider from "./context/userContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CaptionContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </CaptionContextProvider>
  </React.StrictMode>
);
