import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import image from '../../assets/img/profile.png';
import logo from '../../assets/img/image.png';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import AddTasks from './AddTasks';
import PendingTasks from './Tasks/PendingTasks';
import Completed from './Tasks/Completed';
import Archived from './Tasks/Archived';
import TasksContext from '../../contexts/tasks/TasksContext';

const Applayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const navigate = useNavigate();
  
  const openTaskPanel = () => setIsOpen(true);
  const closeTaskpanel = () => {
    setIsOpen(false);
    setTaskToEdit(null);
  };
  const handleEditTask = (task) => {
    setTaskToEdit(task); 
    openTaskPanel();  
  };
  const { 
    fetchCompletedTasks, fetchPendingTasks,
    completedTasks, pendingTasks, archivedTasks,
    completedCount, pendingCount, archivedCount,
  } = useContext(TasksContext);
  
  const noOfTasks = { completed: completedCount, pending: pendingCount, archived: archivedCount };

  const capitalize = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken') || !user) {
      navigate('/');
      return;
    }

    const fetchTasks = async () => {
      try {
        await Promise.all([fetchCompletedTasks(), fetchPendingTasks()]);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [navigate, user, fetchCompletedTasks, fetchPendingTasks]);

  if (!user) {
    return null;
  }

  const avatar = user.avatar !== 'none' ? user.avatar : image;
  const name = capitalize(user.username);

  return (
    <>
      <div className="absolute flex items-center justify-between w-full px-4 py-2">
        <div className='flex items-center space-x-2'>
          <div className='rounded-full h-12 w-12 bg-white'>
            <img src={logo} alt='Profile' className='object-cover rounded-full h-12 w-12' /> 
          </div>
          <p className='text-lg font-bold bg-gradient-to-r from-purple-700 via-blue-800 to-indigo-700 inline-block text-transparent bg-clip-text'> TASKIFY </p>   
        </div>
        <div className='flex flex-row-reverse items-center w-2/3'>
          <div className='rounded-full h-12 w-12 bg-white'>
            <img src={avatar} alt='Profile' className='object-cover rounded-full h-12 w-12' /> 
          </div>
          <p className='mx-5 font-semibold bg-gradient-to-r from-gray-800 via-slate-700 to-black inline-block text-transparent bg-clip-text'>Welcome {name} !!!</p>
        </div>
      </div>
      <div className='h-dvh w-dvw p-16 flex justify-center items-center bg-gradient-to-bl from-slate-500 via-indigo-400 to-cyan-700'>
        <div className='h-full w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-800 overflow-hidden flex relative'>
          <Sidebar openTaskPanel={openTaskPanel} tasks={noOfTasks} />
          <Routes>
            <Route exact path='/tasks/pending' element={<PendingTasks pendingTasks={pendingTasks} pendingCount={pendingCount} onEditTask={handleEditTask} />} />
            <Route exact path='/tasks/completed' element={<Completed completedTasks={completedTasks} completedCount={completedCount} onEditTask={handleEditTask} />} />
            <Route exact path='/tasks/archived' element={<Archived archivedTasks={archivedTasks} archivedCount={archivedCount} onEditTask={handleEditTask} />} />
            <Route exact path="/profile" element={<Profile tasks={noOfTasks} />} />
          </Routes>
          <AddTasks isClosed={!isOpen} closeTaskpanel={closeTaskpanel} editTask={taskToEdit} />
        </div>
      </div>
    </>
  );
};

export default Applayout;
