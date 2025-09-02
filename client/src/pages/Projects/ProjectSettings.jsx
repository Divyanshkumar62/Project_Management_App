import React, { useState, useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { useNavigate, useParams } from "react-router-dom";

const ProjectSettings = () => {
  const { projectId } = useParams();
  const { projects, renameProject, archiveProject, transferOwnership } =
    useContext(ProjectContext);
  const project = projects.find((p) => p._id === projectId);
  const [newName, setNewName] = useState(project?.title || "");
  const [archived, setArchived] = useState(project?.archived || false);
  const [ownerId, setOwnerId] = useState(project?.createdBy);
  const [transferTo, setTransferTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  if (!project) return <div>Project not found</div>;
  if (project.createdBy !== ownerId)
    return <div>Settings available only to Owner</div>;

  const handleRename = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await renameProject(projectId, newName);
      setSuccess("Project renamed");
    } catch (e) {
      setError(e.message || "Rename failed");
    }
    setLoading(false);
  };

  const handleArchive = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await archiveProject(projectId, !archived);
      setArchived(!archived);
      setSuccess(archived ? "Project unarchived" : "Project archived");
    } catch (e) {
      setError(e.message || "Archive failed");
    }
    setLoading(false);
  };

  const handleTransfer = async () => {
    if (!transferTo) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await transferOwnership(projectId, transferTo);
      setSuccess("Ownership transferred");
      setOwnerId(transferTo);
    } catch (e) {
      setError(e.message || "Transfer failed");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Settings</h2>
      <div className="mb-4">
        <label className="block mb-1">Rename Project</label>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleRename}
          disabled={loading}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Archive Project</label>
        <button
          onClick={handleArchive}
          disabled={loading}
          className={`px-3 py-1 rounded ${
            archived ? "bg-yellow-500" : "bg-gray-300"
          }`}
        >
          {archived ? "Unarchive" : "Archive"}
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Transfer Ownership</label>
        <select
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="">Select member</option>
          {project.teamMembers
            .filter((m) => m.user !== ownerId)
            .map((m) => (
              <option key={m.user} value={m.user}>
                {m.user}
              </option>
            ))}
        </select>
        <button
          onClick={handleTransfer}
          disabled={loading || !transferTo}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
        >
          Transfer
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 px-3 py-1 border rounded"
      >
        Back
      </button>
    </div>
  );
};

export default ProjectSettings;
