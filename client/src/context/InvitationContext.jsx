import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  fetchInvitations,
  sendInvitation,
  acceptInvitation,
  declineInvitation,
} from "../services/invitationService";

export const InvitationContext = createContext();

export const InvitationProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await fetchInvitations(auth.token);
      setInvitations(data);
    } catch (err) {
      console.error("Error fetching invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadInvitations();
    }
  }, [auth.token]);

  const sendNewInvitation = async (invitationData) => {
    try {
      const newInvitation = await sendInvitation(auth.token, invitationData);
      setInvitations([...invitations, newInvitation]);
    } catch (err) {
      console.error("Error sending invitation:", err);
    }
  };

  const acceptInvitationById = async (invitationId) => {
    try {
      await acceptInvitation(auth.token, invitationId);
      setInvitations(invitations.filter((inv) => inv._id !== invitationId));
    } catch (err) {
      console.error("Error accepting invitation:", err);
    }
  };

  const declineInvitationById = async (invitationId) => {
    try {
      await declineInvitation(auth.token, invitationId);
      setInvitations(invitations.filter((inv) => inv._id !== invitationId));
    } catch (err) {
      console.error("Error declining invitation:", err);
    }
  };

  return (
    <InvitationContext.Provider
      value={{
        invitations,
        loading,
        sendNewInvitation,
        acceptInvitationById,
        declineInvitationById,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};
