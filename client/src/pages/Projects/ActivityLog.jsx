import React, { useEffect } from "react";
import { useActivity } from "../../context/ActivityContext";
import { formatDistanceToNow } from "date-fns";


const typeIcon = {
  PROJECT_CREATED: "📁",
  INVITE_SENT: "👥",
  INVITE_ACCEPTED: "✅",
  TASK_CREATED: "📋",
  TASK_UPDATED: "✏️",
  TASK_DELETED: "🗑️",
  ROLE_UPDATED: "🔑",
};

const ActivityLog = ({ projectId }) => {
  const { activities, loading, error, loadActivity } = useActivity();

  useEffect(() => {
    if (projectId) loadActivity(projectId);
    // eslint-disable-next-line
  }, [projectId]);

  if (loading)
    return <div className="p-4 text-center">Loading activity...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!activities.length)
    return (
      <div className="p-4 text-center text-gray-500">
        No activities yet for this project.
      </div>
    );

  return (
    <div className="max-h-96 overflow-y-auto divide-y">
      {activities.map((act) => (
        <div key={act._id} className="flex items-center gap-3 py-3">
          <span className="text-2xl">{typeIcon[act.type] || "📝"}</span>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {act.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="font-medium">
              {act.user?.name || act.user?.email || "User"}
            </div>
            <div className="text-gray-700 text-sm">{act.message}</div>
          </div>
          <div className="text-xs text-gray-400 min-w-[80px] text-right">
            {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;
