import { createContext, useEffect, useState } from "react";
import { authenticateSocket, disconnectSocket } from "../socket/socketClient";

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

  const loginUser = async (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuth({ token, user: userData });

    // Authenticate socket for real-time features
    try {
      await authenticateSocket(userData._id);
      console.log("✅ Socket authenticated successfully");
    } catch (error) {
      console.error("❌ Socket authentication failed:", error);
    }
  };

  const logoutUser = () => {
    // Disconnect socket before clearing auth data
    disconnectSocket();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });

    console.log("✅ Socket disconnected");
  };

  return (
    <AuthContext.Provider value={{ auth, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
import { useContext } from "react";
export const useAuth = () => useContext(AuthContext);
