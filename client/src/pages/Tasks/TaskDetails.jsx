import React, { useState, useEffect, useContext } from "react";
import { CommentProvider } from "../../context/CommentContext";
import CommentThread from "../../components/comments/CommentThread";
import AttachmentUploader from "../../components/Tasks/AttachmentUploader";
import AttachmentList from "../../components/Tasks/AttachmentList";
import { TaskContext } from "../../context/TaskContext";
import {
  uploadTaskAttachment,
  deleteAttachment,
} from "../../services/taskService";

export default function TaskDetails({
  taskId,
  currentUser,
  projectId,
  projectMembers,
}) {
  const { auth } = useContext(TaskContext);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch task details and attachments (replace with actual fetch logic)
    // For demo, assume attachments are part of task object
    // setAttachments(task.attachments || []);
  }, [taskId]);

  const handleUpload = async (file, setProgress) => {
    setLoading(true);
    try {
      const att = await uploadTaskAttachment(
        auth.token,
        projectId,
        taskId,
        file
      );
      setAttachments((prev) => [...prev, att]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    setLoading(true);
    try {
      await deleteAttachment(attachmentId);
      setAttachments((prev) => prev.filter((att) => att._id !== attachmentId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommentProvider>
      {/* ...other task details... */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Attachments</h3>
        <AttachmentUploader
          onUpload={handleUpload}
          disabled={loading}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          maxSizeMB={5}
        />
        <AttachmentList
          attachments={attachments}
          onDelete={handleDelete}
          currentUserId={currentUser?._id}
        />
      </div>
      <CommentThread
        taskId={taskId}
        canComment={!!currentUser}
        currentUser={currentUser}
        projectMembers={projectMembers}
      />
    </CommentProvider>
  );
}
