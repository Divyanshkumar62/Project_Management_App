import React, { useState, Suspense } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPlus, FaFilter, FaSearch, FaTasks } from 'react-icons/fa';
import TaskCard from '../task/TaskCard';
import SkeletonTask from '../ui/SkeltonTask';

const TasksTab = ({ 
  tasks = [], 
  isLoading, 
  projectId, 
  onTaskUpdate, 
  onCreateTask 
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group tasks by status
  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // If dropped in different column, update status
    if (sourceStatus !== destStatus) {
      const taskId = typeof result.draggableId === 'object' ? result.draggableId._id : result.draggableId;
      const task = tasks.find(t => t._id === taskId);
      if (task && onTaskUpdate) {
        onTaskUpdate(taskId, { status: destStatus });
      }
    }
  };

  const statusColumns = [
    { id: 'To Do', title: 'To Do', color: 'bg-gray-100 border-gray-300' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50 border-blue-300' },
    { id: 'Completed', title: 'Completed', color: 'bg-green-50 border-green-300' }
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              {[1, 2].map(j => <SkeletonTask key={j} />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
          <p className="text-sm text-gray-600">
            {tasks.length} total tasks • {getTasksByStatus('Completed').length} completed
          </p>
        </div>
        <button
          onClick={onCreateTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FaPlus size={14} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tasks</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-4 rounded-lg border-2 border-dashed min-h-[400px] ${
                      snapshot.isDraggingOver
                        ? 'border-blue-400 bg-blue-50'
                        : column.color
                    }`}
                  >
                    <h4 className="font-semibold mb-4 text-center">
                      {column.title} ({columnTasks.length})
                    </h4>
                    <div className="space-y-3">
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging
                                  ? 'opacity-50 rotate-2 scale-105'
                                  : ''
                              } transition-transform`}
                            >
                              <Suspense fallback={<SkeletonTask />}>
                                <TaskCard task={{ ...task, projectId }} />
                              </Suspense>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">No {column.title.toLowerCase()} tasks</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaTasks size={48} className="mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600">No tasks yet</h4>
            <p className="text-gray-500">Create your first task to get started</p>
          </div>
          <button
            onClick={onCreateTask}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create First Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksTab;
