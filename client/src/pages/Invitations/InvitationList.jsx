import React, { useContext } from "react";
import { InvitationContext } from "../../context/InvitationContext";
import InvitationItem from "../../components/invitation/InvitationItem";

const InvitationList = () => {
  const { invitations, loading } = useContext(InvitationContext);

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invitations</h1>
      {invitations.length === 0 ? (
        <p>No invitations found.</p>
      ) : (
        <div className="grid gap-4">
          {invitations.map((invitation) => (
            <InvitationItem key={invitation._id} invitation={invitation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvitationList;
