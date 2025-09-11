import React, { useEffect, useContext, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/dashboard/Sidebar";
import { useProjects } from "../../hooks/useProjects";
import { useUserTasks } from "../../hooks/useTasks";
import api from "../../services/api";

export default function ProfileView() {
  const { me, loading, error, loadMe, updateAvatar } = useProfile();
  const { auth, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  // Get user stats
  const { data: projects = [] } = useProjects();
  const { data: userTasks = [] } = useUserTasks();

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const handleAvatarUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const response = await api.put('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user data in context immediately
      const updatedUser = { ...auth.user, avatarUrl: response.data.avatarUrl };
      loginUser(auth.token, updatedUser);

      // Update local state immediately
      await loadMe();

      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Avatar upload failed:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );

  if (!me) return null;

  // Calculate stats
  const totalProjects = projects.length;
  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  const activeTasks = userTasks.filter(t => t.status !== 'completed').length;

  // Mock recent activities (replace with real data later)
  const recentActivities = [
    { id: 1, description: "Completed task 'Design Homepage'", timeAgo: "2 hours ago", type: "task" },
    { id: 2, description: "Created new project 'Mobile App'", timeAgo: "1 day ago", type: "project" },
    { id: 3, description: "Updated profile information", timeAgo: "3 days ago", type: "profile" },
    { id: 4, description: "Joined project 'Website Redesign'", timeAgo: "1 week ago", type: "project" }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-lg relative overflow-hidden min-h-full">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
          
          {/* Edit Button - Top Right */}
          <div className="absolute top-6 right-6 z-10">
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-medium"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 pt-24 pb-8 px-8">
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold shadow-lg border-4 border-white">
                  {(me.avatarUrl || auth.user?.avatarUrl) ? (
                    <img src={me.avatarUrl || auth.user?.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    me.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg border-2 border-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{me.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{me.email}</p>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {me.role || 'Member'}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center mb-8">
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-800 hover:text-black transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-blue-600">{totalProjects}</h3>
                <p className="text-blue-700 text-sm font-medium">Projects</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-green-600">{completedTasks}</h3>
                <p className="text-green-700 text-sm font-medium">Completed</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-orange-600">{activeTasks}</h3>
                <p className="text-orange-700 text-sm font-medium">Active Tasks</p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-700 leading-relaxed">
                  {me.bio || <span className="text-gray-400 italic">No bio added yet. Click "Edit Profile" to add one!</span>}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'task' ? 'bg-green-500' : 
                      activity.type === 'project' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    <p className="text-gray-700 flex-1">{activity.description}</p>
                    <span className="text-gray-500 text-sm">{activity.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Timezone</h3>
                <p className="text-lg font-semibold text-gray-800">{me.timezone || 'UTC'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Member Since</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {me.createdAt ? new Date(me.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => navigate('/projects')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                My Projects
              </button>
              <button 
                onClick={() => navigate('/my-tasks')}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                My Tasks
              </button>
              <button 
                onClick={() => navigate('/profile/password')}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
