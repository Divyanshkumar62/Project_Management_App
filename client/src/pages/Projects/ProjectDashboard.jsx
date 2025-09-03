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
    memberStats: rawMemberStats,
    recentActivity: rawRecentActivity,
    upcomingDeadlines: rawUpcomingDeadlines,
  } = dashboardData;

  // Ensure arrays
  const memberStats = Array.isArray(rawMemberStats) ? rawMemberStats : [];
  const recentActivity = Array.isArray(rawRecentActivity) ? rawRecentActivity : [];
  const upcomingDeadlines = Array.isArray(rawUpcomingDeadlines) ? rawUpcomingDeadlines : [];

  // Prepare chart data
  const chartData = [
    { name: "Completed", value: taskStats.completed, color: COLORS[0] },
    { name: "In Progress", value: taskStats.inProgress, color: COLORS[1] },
    { name: "To Do", value: taskStats.toDo, color: COLORS[2] },
    { name: "Overdue", value: taskStats.overdue, color: COLORS[3] },
  ];

  const memberChartData = memberStats.map((member, index) => ({
    name: member.name,
    tasks: member.taskCount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="project-dashboard">
      {/* Project Overview */}
      <div className="dashboard-section project-overview">
        <h2>Project Overview</h2>
        <div className="overview-stats">
          <div className="stat-item">
            <span className="stat-label">Total Tasks:</span>
            <span className="stat-value">{taskStats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value completed">{taskStats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">In Progress:</span>
            <span className="stat-value in-progress">{taskStats.inProgress}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">To Do:</span>
            <span className="stat-value to-do">{taskStats.toDo}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Overdue:</span>
            <span className="stat-value overdue">{taskStats.overdue}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Team Members:</span>
            <span className="stat-value">{memberStats.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Progress:</span>
            <span className="stat-value">
              {taskStats.total > 0
                ? Math.round((taskStats.completed / taskStats.total) * 100)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Task Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Tasks by Team Member</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={memberChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8">
                {memberChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
            {upcomingDeadlines.map((deadline, idx) => (
              <li key={idx} className={deadline.isOverdue ? "overdue" : ""}>
                <span className="deadline-task">{deadline.taskTitle}</span>
                <span className="deadline-date">
                  {formatDate(deadline.dueDate)}
                </span>
                {deadline.isOverdue && (
                  <span className="overdue-label">Overdue</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
