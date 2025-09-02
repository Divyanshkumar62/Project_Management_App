import React from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <button
      className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      onClick={() => navigate("/notifications")}
      aria-label="Notifications"
    >
      <FaBell className="text-blue-600" size={22} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
