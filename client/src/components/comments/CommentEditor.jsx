import React, { useState } from "react";
import { useCommentContext } from "../../context/CommentContext";
// import MentionAutocomplete from './MentionAutocomplete'; // Optional

export default function CommentEditor({
  taskId,
  projectMembers,
  initialContent = "",
  initialMentions = [],
  commentId,
  onCancel,
  onSuccess,
}) {
  const [content, setContent] = useState(initialContent);
  const [mentions, setMentions] = useState(initialMentions);
  const [error, setError] = useState(null);
  const { useCreateComment, useUpdateComment } = useCommentContext();
  const createMutation = useCreateComment(taskId);
  const updateMutation = useUpdateComment(taskId);
  const isEdit = Boolean(commentId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (content.trim().length < 1 || content.length > 5000) {
      setError("Comment must be 1-5000 characters.");
      return;
    }
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ commentId, content, mentions });
        if (onSuccess) onSuccess();
      } else {
        await createMutation.mutateAsync({ content, mentions });
        setContent("");
        setMentions([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error submitting comment");
    }
  };

  return (
    <form
      className="comment-editor flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <textarea
        className="border rounded p-2"
        rows={isEdit ? 3 : 2}
        placeholder="Write a comment... (Markdown supported)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={5000}
        required
      />
      {/* <MentionAutocomplete ... /> */}
      <div className="flex gap-2 items-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={createMutation.isLoading || updateMutation.isLoading}
        >
          {isEdit ? "Save" : "Comment"}
        </button>
        {isEdit && onCancel && (
          <button type="button" className="text-gray-500" onClick={onCancel}>
            Cancel
          </button>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          *bold* _italic_ `code` [link](url)
        </span>
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </form>
  );
}
