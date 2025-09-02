import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InvitationContext } from "../../context/InvitationContext";

const ManageInvitation = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { sendNewInvitation } = useContext(InvitationContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TeamMember");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await sendNewInvitation(projectId, {
        invitedEmail: email,
        role,
      });

      if (result.success) {
        setMessage("Invitation sent successfully!");
        setEmail("");
      } else {
        setMessage(`Error: ${result.error || "Failed to send invitation"}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Send Invitation</h1>
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Project
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("Error") || message.includes("Failed")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          >
            <option value="TeamMember">Team Member</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </div>
  );
};

export default ManageInvitation;
