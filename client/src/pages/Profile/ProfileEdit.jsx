import React, { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import AvatarUploader from "../../components/profile/AvatarUploader";
import { useNavigate } from "react-router-dom";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default function ProfileEdit() {
  const { me, loading, error, loadMe, updateProfile, updateAvatar } =
    useProfile();
  const [form, setForm] = useState({ name: "", bio: "", timezone: "UTC" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (me)
      setForm({
        name: me.name || "",
        bio: me.bio || "",
        timezone: me.timezone || "UTC",
      });
  }, [me]);
  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleAvatar = (file) => setAvatarFile(file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile(form);
      if (avatarFile) await updateAvatar(avatarFile);
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1000);
    } catch {}
    setSaving(false);
  };

  return (
    <form className="max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <AvatarUploader onChange={handleAvatar} currentUrl={me?.avatarUrl} />
      <div className="mb-2">
        <label className="block font-semibold">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          maxLength={100}
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          maxLength={500}
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Timezone</label>
        <select
          name="timezone"
          value={form.timezone}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      {success && <div className="text-green-500 mt-2">Profile updated!</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
