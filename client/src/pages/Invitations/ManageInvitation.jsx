import React, { useContext, useState } from "react";
import { InvitationContext } from "../../context/InvitationContext";

const ManageInvitation = () => {
  const { sendNewInvitation } = useContext(InvitationContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TeamMember");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendNewInvitation({ invitedEmail: email, role });
    setEmail("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send Invitation</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="TeamMember">Team Member</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Invitation
        </button>
      </form>
    </div>
  );
};

export default ManageInvitation;
