import React, { useState } from "react";
import { useCommentContext } from "../../context/CommentContext";
import CommentItem from "./CommentItem";
import CommentEditor from "./CommentEditor";

const DEFAULT_LIMIT = 20;

export default function CommentThread({
  taskId,
  canComment,
  currentUser,
  projectMembers,
}) {
  const [page, setPage] = useState(1);
  const { useComments } = useCommentContext();
  const { data, isLoading, isError, error } = useComments(
    taskId,
    page,
    DEFAULT_LIMIT
  );

  if (isLoading) return <div>Loading comments...</div>;
  if (isError)
    return (
      <div>Error loading comments: {error?.message || "Unknown error"}</div>
    );

  const comments = data?.comments || [];
  const hasMore = comments.length === DEFAULT_LIMIT;

  return (
    <div className="comment-thread">
      <h3 className="mb-2 font-semibold">Discussion</h3>
      {canComment && (
        <CommentEditor taskId={taskId} projectMembers={projectMembers} />
      )}
      <div className="space-y-4 mt-4">
        {comments.length === 0 ? (
          <div className="text-gray-500">No comments yet.</div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              projectMembers={projectMembers}
              taskId={taskId}
            />
          ))
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
