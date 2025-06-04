import React, { useContext } from "react";
import { InvitationContext } from "../../context/InvitationContext";

const InvitationItem = ({ invitation }) => {
  const { acceptInvitationById, declineInvitationById } =
    useContext(InvitationContext);

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{invitation.project.title}</h2>
      <p>Invited by: {invitation.invitedBy.name}</p>
      <p>Role: {invitation.role}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => acceptInvitationById(invitation._id)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => declineInvitationById(invitation._id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default InvitationItem;
