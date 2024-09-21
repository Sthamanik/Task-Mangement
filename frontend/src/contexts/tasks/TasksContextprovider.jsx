import { useState } from 'react';
import TasksContext from './TasksContext';
import axios from 'axios';

const TasksContextProvider = ({ children }) => {
  const server = import.meta.env.VITE_HOST;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);

  // Add a task function (unchanged)
  const addTasks = async (task) => {
    try {
      const response = await axios.post(`${server}/tasks/setTasks`, task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error occurred while adding tasks', err);
    }
  };

  // Function to fetch pending tasks (tasks from today onward)
  const fetchPendingTasks = async () => {
    try {
      const response = await axios.get(`${server}/tasks/getIncompletedTasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        const tasks = response.data.data;

        const today = new Date().setHours(0, 0, 0, 0); // Today's date at midnight
        const pending = tasks.filter(
          (task) => new Date(task.scheduledAt).setHours(0, 0, 0, 0) >= today
        ); // Tasks from today onward
        const archived = tasks.filter(
          (task) => new Date(task.scheduledAt).setHours(0, 0, 0, 0) < today
        ); // Tasks before today

        setPendingTasks(pending);
        setPendingCount(pending.length);

        setArchivedTasks(archived);
        setArchivedCount(archived.length);
      } else {
        setPendingTasks([]);
        setPendingCount(0);
        setArchivedTasks([]);
        setArchivedCount(0);
        console.log('No pending or archived tasks available');
      }
    } catch (err) {
      console.error('Error occurred while fetching pending tasks', err);
    }
  };

  // Function to fetch completed tasks (unchanged)
  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get(`${server}/tasks/getCompletedTasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setCompletedTasks(response.data.data);
        setCompletedCount(response.data.data.length);
      } else {
        setCompletedTasks([]);
        setCompletedCount(0);
        console.log('No completed tasks available');
      }
    } catch (err) {
      console.error('Error occurred while fetching completed tasks', err);
    }
  };

  const values = {
    completedCount,
    completedTasks,
    pendingCount,
    pendingTasks,
    archivedCount,
    archivedTasks,
    addTasks,
    fetchPendingTasks,
    fetchCompletedTasks,
  };

  return (
    <TasksContext.Provider value={values}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksContextProvider;
