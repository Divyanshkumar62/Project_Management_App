import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InvitationContext } from "../../context/InvitationContext";
import InvitationItem from "../../components/invitation/InvitationItem";

const InvitationList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { invitations, loading, loadInvitations } =
    useContext(InvitationContext);

  useEffect(() => {
    if (projectId) {
      loadInvitations(projectId);
    }
  }, [projectId, loadInvitations]);

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invitations</h1>
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/projects/${projectId}/invitations/manage`)
            }
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Send Invitation
          </button>
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Project
          </button>
        </div>
      </div>

      {invitations.length === 0 ? (
        <p>No invitations found.</p>
      ) : (
        <div className="grid gap-4">
          {invitations.map((invitation) => (
            <InvitationItem
              key={invitation._id}
              invitation={invitation}
              projectId={projectId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationList;
