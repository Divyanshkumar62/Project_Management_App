import React, { useEffect } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  const { me, loading, error, loadMe } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!me) return null;

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={me.avatarUrl || "/profile.jpg"}
          alt="avatar"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{me.name}</h2>
          <div className="text-gray-500">{me.email}</div>
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Bio:</span>{" "}
        {me.bio || <span className="text-gray-400">No bio</span>}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Timezone:</span> {me.timezone}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-1 rounded"
          onClick={() => navigate("/profile/password")}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
