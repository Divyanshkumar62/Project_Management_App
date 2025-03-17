import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: null,
  });

  useEffect(() => {
    if (auth.token) {
      const userData = JSON.parse(localStorage.getItem("user")) || null;
      setAuth((prev) => ({ ...prev, user: userData }));
    }
  }, [auth.token]);

   useEffect(() => {
     if (!auth.token) {
       console.warn("❌ No authentication token found. Redirecting to login.");
     }
   }, [auth.token]);

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuth({ token, user: userData });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
