import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SkeletonLoader from "./components/ui/SkeltonLoader";
import LandingPage from "./pages/Home/LandingPage";
import { ProfileProvider } from "./context/ProfileContext";
const ProfileView = lazy(() => import("./pages/Profile/ProfileView"));
const ProfileEdit = lazy(() => import("./pages/Profile/ProfileEdit"));
const ChangePassword = lazy(() => import("./pages/Profile/ChangePassword"));
import { ProjectProvider } from "./context/ProjectContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { TaskProvider } from "./context/TaskContext";
import TaskList from "./pages/Tasks/TaskList";
import { InvitationProvider } from "./context/InvitationContext";
import InvitationList from "./pages/Invitations/InvitationList";
import ManageInvitation from "./pages/Invitations/ManageInvitation";
import { ProtectedRoute, RoleProtectedRoute } from "./routes/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationList from "./pages/Notifications/NotificationList";

// Lazy-loaded components
// Home page removed
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetails = lazy(() => import("./pages/Projects/ProjectDetails"));
const ProjectList = lazy(() => import("./pages/Projects/ProjectList"));
const MyTasks = lazy(() => import("./pages/Tasks/MyTasks"));

const App = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <InvitationProvider>
            <NotificationProvider>
              <ProfileProvider>
                <Router>
                  <Suspense fallback={<SkeletonLoader />}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/tasks" element={<TaskList />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-tasks"
                        element={
                          <ProtectedRoute>
                            <MyTasks />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/projects"
                        element={
                          <ProtectedRoute>
                            <ProjectList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/projects/:projectId"
                        element={
                          <ProtectedRoute>
                            <ProjectDetails />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/projects/:projectId/invitations"
                        element={
                          <RoleProtectedRoute requiredRole="Owner">
                            <InvitationList />
                          </RoleProtectedRoute>
                        }
                      />
                      <Route
                        path="/projects/:projectId/invitations/manage"
                        element={
                          <RoleProtectedRoute requiredRole="Owner">
                            <ManageInvitation />
                          </RoleProtectedRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute>
                            <NotificationList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfileView />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile/edit"
                        element={
                          <ProtectedRoute>
                            <ProfileEdit />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile/password"
                        element={
                          <ProtectedRoute>
                            <ChangePassword />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Router>
              </ProfileProvider>
            </NotificationProvider>
          </InvitationProvider>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;
