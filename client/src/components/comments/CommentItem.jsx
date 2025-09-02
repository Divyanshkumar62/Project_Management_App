import React, { useState } from "react";
import { useCommentContext } from "../../context/CommentContext";
import { formatDistanceToNow } from "date-fns";
import CommentEditor from "./CommentEditor";
import AttachmentUploader from "../Tasks/AttachmentUploader";
import AttachmentList from "../Tasks/AttachmentList";
import { uploadCommentAttachment } from "../../services/commentService";
import { deleteAttachment } from "../../services/taskService";

export default function CommentItem({
  comment,
  currentUser,
  projectMembers,
  taskId,
}) {
  const [editing, setEditing] = useState(false);
  const { useUpdateComment, useDeleteComment } = useCommentContext();
  const updateMutation = useUpdateComment(taskId);
  const deleteMutation = useDeleteComment(taskId);
  const isAuthor =
    currentUser && comment.author && currentUser._id === comment.author._id;
  const isOwner = currentUser && currentUser.role === "Owner";
  const [attachments, setAttachments] = useState(comment.attachments || []);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file, setProgress) => {
    setLoading(true);
    try {
      const att = await uploadCommentAttachment(
        currentUser.token,
        comment.project,
        comment._id,
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
      await deleteAttachment(currentUser.token, attachmentId);
      setAttachments((prev) => prev.filter((att) => att._id !== attachmentId));
    } finally {
      setLoading(false);
    }
  };

  if (comment.isDeleted) {
    return <div className="text-gray-400 italic">[deleted]</div>;
  }

  return (
    <div className="comment-item border rounded p-2 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <img
          src={comment.author?.avatarUrl || "/profile.jpg"}
          alt="avatar"
          className="w-6 h-6 rounded-full"
        />
        <span className="font-medium">{comment.author?.name || "Unknown"}</span>
        <span className="text-xs text-gray-400 ml-2">
          {formatDistanceToNow(new Date(comment.createdAt))} ago
        </span>
        {comment.isEdited && (
          <span className="text-xs text-blue-400 ml-2">(edited)</span>
        )}
      </div>
      {editing ? (
        <CommentEditor
          taskId={taskId}
          projectMembers={projectMembers}
          initialContent={comment.content}
          initialMentions={comment.mentions}
          commentId={comment._id}
          onCancel={() => setEditing(false)}
          onSuccess={() => setEditing(false)}
        />
      ) : (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(comment.content) }}
        />
      )}
      {/* Attachments UI */}
      <div className="mt-2">
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
      {(isAuthor || isOwner) && !editing && !comment.isDeleted && (
        <div className="flex gap-2 mt-1">
          <button
            className="text-xs text-blue-500"
            onClick={() => setEditing(true)}
            disabled={updateMutation.isLoading}
          >
            Edit
          </button>
          <button
            className="text-xs text-red-500"
            onClick={() => deleteMutation.mutate(comment._id)}
            disabled={deleteMutation.isLoading}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// Simple markdown renderer (bold, italic, code, links)
function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  return html;
}
