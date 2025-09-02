import React, { createContext, useContext, useState, useCallback } from "react";
import * as profileService from "../services/profileService";

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getMe();
      setMe(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.updateMe(payload);
      setMe(data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.updatePassword(payload);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const data = await profileService.updateAvatar(formData);
      setMe((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update avatar");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        me,
        loading,
        error,
        loadMe,
        updateProfile,
        updatePassword,
        updateAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
