// This file is the entry point of all routes.
// It enables navigation, links, and routing for the entire app.
// Think of it like setting up your app’s “toolbox” of essential features.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // global styles (Tailwind or other CSS)
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext"; 
// import { UserRegisterProvider } from "./context/UserRegisterContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> */}
      <BrowserRouter>
        {/* <AuthProvider> */}
          {/* <UserRegisterProvider> */}
            {/* <ThemeProvider> */}
              
              <App />
              
            {/* </ThemeProvider> */}
          {/* </UserRegisterProvider> */}
        {/* </AuthProvider> */}
      </BrowserRouter>
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);
