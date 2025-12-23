/* Purpose of This Code

It creates a User Registration Context that:

✅ Collects data (like college name, email, etc.) step by step across different pages.

💾 Saves that data in localStorage so it persists even if the user refreshes the page.

🔄 Makes the data available on all registration pages via the context.

*/


import React, { createContext, useContext, useState } from "react";

const UserRegisterContext = createContext(); // This is like a global container that can store and share data across components.

const STORAGE_KEY = "userRegisterData";

// This is the empty structure used when no data is saved yet.

const defaultData = {
 
  
  email: "",
  name: "",
  // password: "",
  avatar: "",   // base64 image or URL
  bio: "",      // short user intro
  authMethod: "email" | "google"
};

const allowedFields = Object.keys(defaultData); // Only allow known fields to be updated

export const UserRegisterProvider = ({ children }) => {
//   const [formData, setFormData] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEY); // It checks localStorage for previously entered data. , If not, it uses the default empty values.
//     const parsed = saved ? JSON.parse(saved) : {};

//      delete parsed.password;
     
//      const filled = { ...defaultData, ...parsed };
//     // return saved ? JSON.parse(saved) : defaultData; // If found, it loads it (JSON.parse).


 
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(filled));
//   return filled;
// });
  

const resetForm = () => {
  setFormData({ ...defaultData });
};

const [formData, setFormData] = useState(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const parsed = typeof saved === "object" && saved !== null ? saved : {};
    delete parsed.password;

    const filled = { ...defaultData, ...parsed };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filled));
    return filled;
  } catch (error) {
    console.error("Failed to parse user register data from localStorage:", error);
    localStorage.removeItem(STORAGE_KEY);
    return { ...defaultData };
  }
});

    const updateField = (field, value) => {
      if(!allowedFields.includes(field)) {
        console.warn(`Ignored attempt to update unsupported field: "${field}"`)
        return;
      }

      setFormData((prev) => {
        const updated = {...prev, [field]: value}; // Example: when you type an email, it: Updates the email field in formData.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // Immediately saves it to localStorage.
 
        return updated;
      });
    };

  // const updateField = (field, value) => {
  //   setFormData((prev) => {
  //     const updated = { ...prev, [field]: value }; // Example: when you type an email, it: Updates the email field in formData.

      

  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // Immediately saves it to localStorage.
  //     return updated;

     
  //   });
  // };

  const clearFormData = () => {
    // Use this after registration is complete. It resets everything both in memory and in localStorage.
    localStorage.removeItem(STORAGE_KEY);
    setFormData(defaultData);
  };

const logFormData = () => {
  console.log("Form Data:", formData);
};


  return (
    // This wraps your app (or part of it). It makes formData, updateField, and clearFormData available to all child components.
    <UserRegisterContext.Provider
      value={{ formData,setFormData, updateField, clearFormData, logFormData , resetForm, }}
    >
      {children}
    </UserRegisterContext.Provider>
  );
};

export const useUserRegister = () => useContext(UserRegisterContext);
