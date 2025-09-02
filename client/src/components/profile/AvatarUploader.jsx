import React, { useRef } from "react";

export default function AvatarUploader({ onChange, currentUrl }) {
  const fileRef = useRef();
  return (
    <div className="mb-2 flex items-center gap-4">
      <img
        src={currentUrl || "/profile.jpg"}
        alt="avatar"
        className="w-16 h-16 rounded-full border"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files[0])}
      />
      <button
        type="button"
        className="bg-gray-200 px-2 py-1 rounded"
        onClick={() => fileRef.current.click()}
      >
        Change Avatar
      </button>
    </div>
  );
}
