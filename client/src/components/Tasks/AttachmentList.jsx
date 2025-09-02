import React from "react";

const getIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
  if (["pdf"].includes(ext)) return "📄";
  if (["doc", "docx"].includes(ext)) return "📃";
  return "📎";
};

const AttachmentList = ({ attachments, onDelete, currentUserId }) => (
  <div className="flex flex-col gap-2 mt-2">
    {attachments && attachments.length > 0 ? (
      attachments.map((att) => (
        <div
          key={att._id || att.filename}
          className="flex items-center gap-2 border p-2 rounded"
        >
          <span>{getIcon(att.filename)}</span>
          <a
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {att.filename}
          </a>
          <span className="text-xs text-gray-500">
            {new Date(att.createdAt).toLocaleString()}
          </span>
          {(att.uploadedBy === currentUserId || att.canDelete) && (
            <button
              onClick={() => onDelete(att._id)}
              className="text-red-500 text-xs ml-2"
            >
              Delete
            </button>
          )}
        </div>
      ))
    ) : (
      <span className="text-gray-400">No attachments</span>
    )}
  </div>
);

export default AttachmentList;
