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
import { ProjectProvider } from "./context/ProjectContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { TaskProvider } from "./context/TaskContext";
import TaskList from "./pages/Tasks/TaskList";
import { InvitationProvider } from "./context/InvitationContext";
import InvitationList from "./pages/Invitations/InvitationList";
import ManageInvitation from "./pages/Invitations/ManageInvitation";

// Lazy-loaded components
// const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Simulated authentication check
const isAuthenticated = () => {
  return localStorage.getItem("token") ? true : false;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <InvitationProvider>
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
                  <Route path="/invitations" element={<InvitationList />} />
                  <Route
                    path="/invitations/manage"
                    element={<ManageInvitation />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </InvitationProvider>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;
