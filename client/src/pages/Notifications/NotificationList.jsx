import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { Link } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";

const NotificationList = () => {
  const { notifications, loading, error, markAsRead, deleteNotification } =
    useNotifications();

  if (loading)
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 text-center">Loading notifications...</div>
        </div>
      </div>
    );
  if (error) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 text-red-500">{error}</div>
      </div>
    </div>
  );
  if (!notifications.length)
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 text-gray-500">No notifications yet.</div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`flex items-start bg-white rounded shadow p-4 border-l-4 ${
              n.isRead ? "border-gray-200" : "border-blue-500"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    n.isRead ? "bg-gray-300" : "bg-blue-500"
                  }`}
                ></span>
                <span className="font-medium">{n.type.replace("_", " ")}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">{n.message}</div>
              {n.project && (
                <div className="text-xs text-gray-500 mt-1">
                  Project:{" "}
                  <span className="font-semibold">
                    {n.project.title || n.project}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 ml-4">
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => deleteNotification(n._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
