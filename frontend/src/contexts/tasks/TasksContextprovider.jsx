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

  const fetchPendingTasks = async () => {
    try {
      const response = await axios.get(`${server}/tasks/getIncompletedTasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
  
      if (response.data && Array.isArray(response.data.data)) {
        const tasks = response.data.data;
        const currTime = new Date();
  
        const pending = tasks.filter(task => new Date(task.scheduledAt) >= currTime);
        const archived = tasks.filter(task => new Date(task.scheduledAt) < currTime);
  
        // Set tasks and their counts
        setPendingTasks(pending);
        setArchivedTasks(archived);
        setPendingCount(pending.length);
        setArchivedCount(archived.length);
      } else {
        // Handle case where no tasks are returned
        setPendingTasks([]);
        setArchivedTasks([]);
        setPendingCount(0);
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

  const updateTask = async (task) => {
    try {
      const response = await axios.put(`${server}/tasks/updateTask?id=${task._id}`, task, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      });
      return response.data
    } catch (err) {
      console.error("Error Occured While updating tasks", err.message)
    }
  }

  const markComplete = async (task) => {
    try {
      const response = await axios.put(`${server}/tasks/setCompleted`, task,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params:{
          id: task._id
        }
      })
      return response.data;
    } catch (err) {
      console.error("Error Occured While marking task as completed", err.message);
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`${server}/tasks/deleteTask` ,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        params:{ id }
      })
      return response.data;
    } catch (err) {
      console.error("Error Occured While marking task as completed", err.message);
    }
  }

  const deleteAllCompleted = async () => {
    try {
      const response = await axios.delete(`${server}/tasks/deleteAll`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      return response.data;
    } catch (err) {
      console.error("Error Occured While marking task as completed", err.message);
    }
  }

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
    updateTask,
    markComplete,
    deleteTask,
    deleteAllCompleted,
  };

  return (
    <TasksContext.Provider value={values}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksContextProvider;
