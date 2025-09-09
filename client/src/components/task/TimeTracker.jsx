import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlay, FaPause, FaClock, FaTimes } from 'react-icons/fa';
import * as timeTrackingService from '../../services/timeTrackingService';

const TimeTracker = ({ taskId, projectId }) => {
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [description, setDescription] = useState('');
  const intervalRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch time entries for this task
  const { data: timeEntries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['timeEntries', taskId],
    queryFn: () => timeTrackingService.getTaskTimeEntries(taskId),
    enabled: !!taskId
  });

  // Fetch current running timer
  const { data: currentTimer, isLoading: timerLoading } = useQuery({
    queryKey: ['currentTimer'],
    queryFn: () => timeTrackingService.getCurrentTimer(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mutations for time tracking
  const startMutation = useMutation({
    mutationFn: (params) => timeTrackingService.startTimeTracking(params.taskId, params.description),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeEntries', taskId]);
      queryClient.invalidateQueries(['currentTimer']);
      setCurrentTime(0); // Reset local timer
    },
    onError: (error) => {
      alert('Failed to start timer: ' + (error.message || 'Please try again'));
    }
  });

  const stopMutation = useMutation({
    mutationFn: (taskId) => timeTrackingService.stopTimeTracking(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeEntries', taskId]);
      queryClient.invalidateQueries(['currentTimer']);
    },
    onError: (error) => {
      alert('Failed to stop timer: ' + (error.message || 'Please try again'));
    }
  });

  // Timer state management
  const isRunning = currentTimer?.task?._id === taskId && currentTimer?.isRunning;
  const currentEntry = timeEntries.find(entry => entry.task === taskId && entry.isRunning);

  // Update local timer display
  useEffect(() => {
    if (isRunning && currentEntry) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Date.now() - new Date(currentEntry.startTime).getTime());
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentTime(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentEntry]);

  // Calculate total time spent on this task
  const totalMinutes = timeEntries.reduce((total, entry) => {
    if (!entry.isRunning) {
      return total + (entry.duration || 0);
    }
    return total; // Don't include running timer in total
  }, 0);

  const handleStartTimer = () => {
    if (currentTimer && currentTimer.task?._id !== taskId) {
      alert('You have an active timer on another task. Please stop it first.');
      return;
    }
    startMutation.mutate({
      taskId,
      description: description.trim() || undefined
    });
    setShowTimeModal(false);
    setDescription('');
  };

  const handleStopTimer = () => {
    if (isRunning) {
      stopMutation.mutate(taskId);
    } else {
      alert('No active timer to stop');
    }
  };

  const formatTimeDisplay = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalTimeDisplay = timeTrackingService.formatDuration(totalMinutes);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaClock className="text-blue-500" />
          Time Tracking
        </h3>
        <div className="text-sm text-gray-600">
          Total: <span className="font-medium">{totalTimeDisplay}</span>
        </div>
      </div>

      {/* Current Timer Section */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-700">Current Session</div>
            <div className="text-xl font-mono text-blue-600">
              {formatTimeDisplay(currentTime || (isRunning ? Date.now() - new Date(currentEntry?.startTime).getTime() : 0))}
            </div>
            {isRunning && (
              <div className="text-xs text-green-600 mt-1">Timer running...</div>
            )}
          </div>

          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={() => setShowTimeModal(true)}
                disabled={startMutation.isLoading}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <FaPlay size={14} />
                Start
              </button>
            ) : (
              <button
                onClick={handleStopTimer}
                disabled={stopMutation.isLoading}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <FaPause size={14} />
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Time Entries List */}
      {entriesLoading ? (
        <div className="text-center py-4">Loading time entries...</div>
      ) : timeEntries.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Recent Time Entries</h4>
          {timeEntries.filter(entry => !entry.isRunning).slice(0, 3).map((entry) => (
            <div key={entry._id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
              <div>
                <div className="font-medium">{timeTrackingService.formatDuration(entry.duration)}</div>
                <div className="text-gray-500 text-xs">
                  {new Date(entry.startTime).toLocaleString()}
                  {entry.description && ` - ${entry.description}`}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {entry.user.name}
              </div>
            </div>
          ))}
          {timeEntries.filter(entry => !entry.isRunning).length > 3 && (
            <button
              onClick={() => setShowTimeModal(true)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              View all time entries
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <FaClock size={24} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">No time entries yet</p>
          <p className="text-gray-400 text-xs">Start your first timer to track time</p>
        </div>
      )}

      {/* Start Timer Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              Start Time Tracking
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="What are you working on?"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartTimer}
                disabled={startMutation.isLoading}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {startMutation.isLoading ? 'Starting...' : 'Start Timer'}
              </button>
              <button
                type="button"
                onClick={() => setShowTimeModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
