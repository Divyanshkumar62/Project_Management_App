import React, { useContext, useState } from "react";
import { InvitationContext } from "../../context/InvitationContext";

const InvitationItem = ({ invitation, projectId }) => {
  const { acceptInvitationById, declineInvitationById } =
    useContext(InvitationContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleAccept = async () => {
    setIsProcessing(true);
    setMessage("");

    try {
      const result = await acceptInvitationById(projectId, invitation._id);
      if (result.success) {
        setMessage("Invitation accepted successfully!");
      } else {
        setMessage(`Error: ${result.error || "Failed to accept invitation"}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    setMessage("");

    try {
      const result = await declineInvitationById(projectId, invitation._id);
      if (result.success) {
        setMessage("Invitation declined successfully!");
      } else {
        setMessage(`Error: ${result.error || "Failed to decline invitation"}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{invitation.project.title}</h2>
      <p>Invited by: {invitation.invitedBy.name}</p>
      <p>Role: {invitation.role}</p>

      {message && (
        <div
          className={`mt-2 p-2 rounded text-sm ${
            message.includes("Error") || message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className={`px-4 py-2 rounded ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {isProcessing ? "Processing..." : "Accept"}
        </button>
        <button
          onClick={handleDecline}
          disabled={isProcessing}
          className={`px-4 py-2 rounded ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          } text-white`}
        >
          {isProcessing ? "Processing..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default InvitationItem;
