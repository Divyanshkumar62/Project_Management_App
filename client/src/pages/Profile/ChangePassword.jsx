import React, { useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { updatePassword, error } = useProfile();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    if (form.newPassword !== form.confirm) {
      setErrMsg("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setErrMsg(err?.response?.data?.message || "Failed to update password");
    }
    setSaving(false);
  };

  return (
    <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <div className="mb-2">
        <label className="block font-semibold">Current Password</label>
        <input
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
          minLength={6}
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">New Password</label>
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
          minLength={8}
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Confirm New Password</label>
        <input
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
          minLength={8}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
        disabled={saving}
      >
        {saving ? "Saving..." : "Change Password"}
      </button>
      {success && <div className="text-green-500 mt-2">Password updated!</div>}
      {(errMsg || error) && (
        <div className="text-red-500 mt-2">{errMsg || error}</div>
      )}
    </form>
  );
}
