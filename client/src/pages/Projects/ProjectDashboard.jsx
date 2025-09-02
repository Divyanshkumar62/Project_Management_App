import React, { useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d9534f"];
const STATUS_LABELS = ["Completed", "In Progress", "To Do", "Overdue"];

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export default function ProjectDashboard({ projectId }) {
  const { dashboardData, loading, error, loadDashboard } = useDashboard();

  useEffect(() => {
    if (projectId) loadDashboard(projectId);
  }, [projectId, loadDashboard]);

  if (loading)
    return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error)
    return (
      <div className="dashboard-error">
        {error} <button onClick={() => loadDashboard(projectId)}>Retry</button>
      </div>
    );
  if (!dashboardData)
    return <div className="dashboard-empty">No dashboard data available.</div>;

  const {
    projectInfo,
    taskStats,
    memberStats,
    recentActivity,
    upcomingDeadlines,
  } = dashboardData;

  // Prepare chart data
  const chartData = [
    { name: "Completed", value: taskStats.completed },
    { name: "In Progress", value: taskStats.inProgress },
    { name: "To Do", value: taskStats.todo },
    { name: "Overdue", value: taskStats.overdue },
  ];

  return (
    <div className="project-dashboard">
      {/* Project Info Card */}
      <div className="dashboard-section info-card">
        <h2>{projectInfo.name}</h2>
        <p>{projectInfo.description}</p>
        <span className="dashboard-date">
          Created: {formatDate(projectInfo.createdAt)}
        </span>
      </div>

      {/* Task Stats Chart */}
      <div className="dashboard-section task-stats">
        <h3>Task Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Member Stats */}
      <div className="dashboard-section member-stats">
        <h3>Members</h3>
        <span>Total: {memberStats.totalMembers}</span>
        <div>
          <span className="badge owner">Owner: {memberStats.roles.owner}</span>
          <span className="badge member">
            Members: {memberStats.roles.members}
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section recent-activity">
        <h3>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="empty">No recent activity.</div>
        ) : (
          <ul>
            {recentActivity.map((a, idx) => (
              <li key={idx}>
                <span className={`activity-type ${a.type.toLowerCase()}`}>
                  {a.type}
                </span>
                <span className="activity-message" title={a.message}>
                  {a.message}
                </span>
                <span className="activity-user">by {a.user.name}</span>
                <span className="activity-date">{formatDate(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <div className="dashboard-section upcoming-deadlines">
        <h3>Upcoming Deadlines</h3>
        {upcomingDeadlines.length === 0 ? (
          <div className="empty">No upcoming deadlines.</div>
        ) : (
          <ul>
            {upcomingDeadlines.map((t, idx) => (
              <li key={idx}>
                <span
                  className={`badge status-${t.status
                    .replace(/\s/g, "")
                    .toLowerCase()}`}
                >
                  {t.status}
                </span>
                <span className="deadline-title" title={t.title}>
                  {t.title}
                </span>
                <span className="deadline-date">
                  Due: {formatDate(t.dueDate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
