import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  fetchInvitations,
  sendInvitation,
  acceptInvitation,
  declineInvitation,
} from "../services/invitationService";

const InvitationContext = createContext();

export const useInvitations = () => {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error("useInvitations must be used within InvitationProvider");
  }
  return context;
};

export const InvitationProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInvitations = async (projectId) => {
    if (!auth?.token) return;
    
    setLoading(true);
    try {
      const data = await fetchInvitations(projectId);
      setInvitations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading invitations:", err);
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  const sendNewInvitation = async (projectId, invitationData) => {
    try {
      const newInvitation = await sendInvitation(projectId, invitationData);
      setInvitations([...invitations, newInvitation]);
      return { success: true };
    } catch (err) {
      console.error("Error sending invitation:", err);
      return { success: false, error: err.message };
    }
  };

  const acceptProjectInvitation = async (projectId, invitationId) => {
    try {
      await acceptInvitation(projectId, invitationId);
      setInvitations(
        invitations.filter((inv) => inv._id !== invitationId)
      );
      return { success: true };
    } catch (err) {
      console.error("Error accepting invitation:", err);
      return { success: false, error: err.message };
    }
  };

  const declineProjectInvitation = async (projectId, invitationId) => {
    try {
      await declineInvitation(projectId, invitationId);
      setInvitations(
        invitations.filter((inv) => inv._id !== invitationId)
      );
      return { success: true };
    } catch (err) {
      console.error("Error declining invitation:", err);
      return { success: false, error: err.message };
    }
  };

  return (
    <InvitationContext.Provider
      value={{
        invitations,
        loading,
        loadInvitations,
        sendNewInvitation,
        acceptProjectInvitation,
        declineProjectInvitation,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};

export { InvitationContext };
