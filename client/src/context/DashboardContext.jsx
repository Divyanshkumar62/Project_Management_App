import React, { createContext, useContext, useState, useCallback } from "react";
import { getProjectDashboard } from "../services/dashboardService";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectDashboard(projectId);
      setDashboardData(data);
    } catch (err) {
      setError(err.msg || "Error loading dashboard");
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{ dashboardData, loading, error, loadDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
