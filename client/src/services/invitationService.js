import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/invitations";

export const sendInvitation = async (token, invitationData) => {
  const response = await axios.post(API_BASE_URL, invitationData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchInvitations = async (token) => {
  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const acceptInvitation = async (token, invitationId) => {
  const response = await axios.put(
    `${API_BASE_URL}/${invitationId}/accept`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const declineInvitation = async (token, invitationId) => {
  const response = await axios.put(
    `${API_BASE_URL}/${invitationId}/decline`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
