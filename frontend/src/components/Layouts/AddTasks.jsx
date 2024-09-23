import { CircleX } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import TasksContext from '../../contexts/tasks/TasksContext';
import { useNavigate } from 'react-router-dom';

const AddTasks = ({ isClosed, closeTaskpanel, editTask }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    type: 'primary',
  });
  
  const { addTasks, updateTask } = useContext(TasksContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [trySubmitting, setTrySubmitting] = useState(false);

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    scheduledAt: false,
  });

  const types = ['Primary', 'Personal', 'Others'];

  // If `editTask` is provided, pre-fill the form with the task data
  useEffect(() => {
    if (editTask) {
      setTask(editTask);
    }
  }, [editTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleTypeSelection = (type) => {
    setTask({
      ...task,
      type: type.toLowerCase(),
    });
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTask) {
        // Update the existing task
        const result = await updateTask(task);
        if (result.success) {
          closeTaskpanel();
          navigate('/app/tasks/pending');
        }
      } else {
        // Add a new task
        const result = await addTasks(task);
        if (result.success) {
          setTask({
            title: '',
            description: '',
            scheduledAt: '',
            type: 'primary',
          });
          closeTaskpanel();
          navigate('/app/tasks/pending');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Validation logic
  const isTitleValid = (title) => /^[a-zA-Z\s\-]{1,20}$/.test(title);
  const isDescriptionValid = (description) => /^[a-zA-Z0-9\s]{1,40}$/.test(description);
  const isScheduledAtValid = (scheduledAt) => {
    const scheduledDate = new Date(scheduledAt);
    return new Date() <= scheduledDate;
  };

  const isFormValid = () => {
    return isTitleValid(task.title) && isDescriptionValid(task.description) && isScheduledAtValid(task.scheduledAt);
  };

  return (
    <div className={`absolute bg-slate-300 h-full right-0 z-10 w-1/4 shadow-lg flex flex-col justify-between ${isClosed ? 'translate-x-full' : 'translate-x-0'} transition-all ease-in-out duration-150`}>
      <button className='absolute right-2 top-2 hover:text-indigo-800 focus:outline-none' aria-label="Close" onClick={() => closeTaskpanel()}>
        <CircleX />
      </button>

      <form className='flex flex-col p-4 w-full' onSubmit={handleSubmit}>
        <h3 className='text-xl font-semibold mb-4'>{editTask ? 'Edit Task' : 'New Task'}</h3>

        {/* Title Field */}
        <div className='mb-3'>
          <label htmlFor="title" className='text-md font-semibold text-gray-800'>Title</label>
          <input
            type="text"
            className='w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-700 placeholder:text-gray-500'
            placeholder='Task title...'
            name='title'
            value={task.title}
            onChange={handleChange}
            onFocus={() => setTouched({ ...touched, title: true })}
          />
          {touched.title && !isTitleValid(task.title) && (
            <p className="text-sm text-red-600">Title must be 1-20 letters only.</p>
          )}
        </div>

        {/* Description Field */}
        <div className='mb-3'>
          <label htmlFor="description" className='text-md font-semibold text-gray-800'>Description</label>
          <textarea
            className='w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-700 placeholder:text-gray-500 resize-none'
            placeholder='Task description...'
            name="description"
            value={task.description}
            onChange={handleChange}
            onFocus={() => setTouched({ ...touched, description: true })}
          />
          {touched.description && !isDescriptionValid(task.description) && (
            <p className="text-sm text-red-600">Description must be 1-40 alphanumeric characters.</p>
          )}
        </div>

        {/* Schedule Field */}
        <div className='mb-3'>
          <label htmlFor="scheduleAt" className='text-md font-semibold text-gray-800'>Schedule At</label>
          <input
            type="datetime-local"
            className='w-full p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-700'
            name="scheduledAt"
            value={task.scheduledAt}
            onChange={handleChange}
            onFocus={() => setTouched({ ...touched, scheduledAt: true })}
          />
          {touched.scheduledAt && !isScheduledAtValid(task.scheduledAt) && (
            <p className="text-sm text-red-600">Please select a valid date.</p>
          )}
        </div>

        {/* Type Field */}
        <div className='mb-3'>
          <label htmlFor="type" className='text-md font-semibold text-gray-800'>Type</label>
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className='bg-gray-100 p-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600'>
              {task.type}
            </div>
            {isDropdownOpen && (
              <ul className='absolute bg-white w-full border border-gray-300 rounded-md shadow-lg z-10'>
                {types.map((type, index) => (
                  <li
                    key={index}
                    onClick={() => handleTypeSelection(type)}
                    className='p-2 bg-gray-100 hover:bg-indigo-400 hover:text-white cursor-pointer'
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </form>

      <div className='flex w-full items-center justify-around mb-8'>
        <div className="w-1/3" onMouseEnter={() => setTrySubmitting(true)} onMouseLeave={() => setTrySubmitting(false)}>
          <button
            type='submit'
            className={`w-full p-2 rounded-md text-white focus:outline-none ${isFormValid() ? 'bg-indigo-600 hover:bg-indigo-800' : 'bg-indigo-500 cursor-not-allowed'}`}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            {editTask ? 'Update' : 'Save'}
          </button>
        </div>
        {trySubmitting && !isFormValid() && (
          <p className="absolute bottom-2 text-sm text-red-600">Fill all the fields</p>
        )}
      </div>
    </div>
  );
};

export default AddTasks;
