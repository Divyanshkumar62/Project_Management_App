import React, { createContext, useContext, useState, useCallback } from "react";
import { getProjectActivity } from "../services/activityService";

const ActivityContext = createContext();

export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadActivity = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectActivity(projectId);
      setActivities(data);
    } catch (err) {
      setError(err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ActivityContext.Provider
      value={{ activities, loading, error, loadActivity }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
