import React, { useContext, useState, useEffect, useRef } from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskCard from "../../components/task/TaskCard";

const DEBOUNCE_MS = 300;

const statusOptions = ["All", "To Do", "In Progress", "Completed"];
const priorityOptions = ["All", "Low", "Medium", "High"];

const TaskList = () => {
  const { filterTasks } = useContext(TaskContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const debounceRef = useRef();

  // Replace with actual projectId from context/router if needed
  const projectId = null; // TODO: get current projectId

  useEffect(() => {
    if (!projectId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const params = {
          q: search,
          status: status !== "All" ? status : undefined,
          priority: priority !== "All" ? priority : undefined,
          page,
          limit,
        };
        const data = await filterTasks(projectId, params);
        setTasks(data.tasks || []);
        setTotal(data.total || 0);
        setError("");
      } catch (err) {
        setError("Error loading tasks");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [search, status, priority, page, limit, projectId, filterTasks]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };
  const handlePriority = (e) => {
    setPriority(e.target.value);
    setPage(1);
  };
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (tasks.length === limit && page * limit < total) setPage((p) => p + 1);
  };

  // Always use an array for mapping
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return ( 
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project Tasks</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input 
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={status}
          onChange={handleStatus}
          className="border px-2 py-2 rounded"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={handlePriority}
          className="border px-2 py-2 rounded"
        >
          {priorityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></span>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : safeTasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <svg
            className="mx-auto mb-2"
            width="48"
            height="48"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path stroke="#a0aec0" strokeWidth="2" d="M7 12h10M7 16h6M9 8h6" />
            <rect
              width="20"
              height="16"
              x="2"
              y="4"
              stroke="#a0aec0"
              strokeWidth="2"
              rx="2"
            />
          </svg>
          <p className="text-lg font-semibold mb-2">No Tasks Found</p>
          <p className="mb-4">
            You don't have any tasks yet. Start by creating your first task!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {safeTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={handleNext}
              disabled={safeTasks.length < limit || page * limit >= total}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;
