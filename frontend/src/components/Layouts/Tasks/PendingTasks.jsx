import { CircleCheck, CircleX, EllipsisVertical, Pen, Trash2 } from 'lucide-react';
import React, { useContext, useState } from 'react';
import TasksContext from '../../../contexts/tasks/TasksContext';
import { useLocation, useNavigate } from 'react-router-dom';

const PendingTasks = ({ pendingTasks, pendingCount, onEditTask }) => {
  const [clickedIndex, setClickedIndex] = useState(null);
  const [hoverEdit, setHoverEdit] = useState(false);
  const [hoverComplete, setHoverComplete] = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);
  const {markComplete, deleteTask} = useContext(TasksContext)
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date();
  const groupTasksByDate = (tasks) => {
    return tasks.reduce((acc, task) => {
      const taskDate = new Date(task.scheduledAt).toLocaleDateString();
      if (!acc[taskDate]) {
        acc[taskDate] = [];
      }
      acc[taskDate].push(task);
      return acc;
    }, {});
  };
  const groupedTasks = groupTasksByDate(pendingTasks);

  const futureDates = Object.keys(groupedTasks)
    .filter((date) => new Date(date) >= today)
    .sort((a, b) => new Date(a) - new Date(b));

  const handleCompleted = async (e, task) => {
    e.preventDefault();
    try{
      const result = await markComplete(task);
      if (result.success){
        navigate(`${location.pathname}`)
      }
    }catch(err){
      console.error('Error completing task:', err);
    }
  }

  const handleDeleteTask = async (e, id) => {
    e.preventDefault();
    try{
      const result = await deleteTask(id);
      if (result.success){
        navigate(`${location.pathname}`)
      }
    }catch(err){

    }
  }
  return (
    <div className="w-4/5 h-full p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Tasks</h1>

      {/* Timeline in Grid View */}
      <div className="grid grid-cols-1 gap-8">
        {pendingCount === 0 ? (
          <p className="text-gray-600">No upcoming tasks</p>
        ) : (
          futureDates.map((date, index) => (
            <div key={index} className="relative border-l-2 border-gray-300">
              <div className="mb-4 ml-4">
                <h2 className="text-xl font-semibold text-indigo-600">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-8 relative">
                {groupedTasks[date].map((task) => (
                  <div
                    key={task._id}
                    className="relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className='absolute right-2 top-4 hover:cursor-pointer flex flex-row-reverse z-10'>
                      { clickedIndex === task._id ? 
                      <CircleX onClick={() => setClickedIndex(null)}/>:
                      <EllipsisVertical onClick={() => setClickedIndex(task._id)}/>
                      }
                      <div className={`flex flex-col space-y-2 ${clickedIndex === task._id? 'translate-x-0 translate-y-0 scale-100' : 'translate-x-10 -translate-y-10 scale-0'} transition-all duration-200 ease-in-out mr-2`}>
                        <button className='flex flex-row-reverse items-center text-gray-700 hover:text-blue-700 bg-slate-100'>
                          <Pen onMouseEnter={()=> setHoverEdit(true)} onMouseLeave={() => setHoverEdit(false)} onClick={() => onEditTask(task)}/>
                          {hoverEdit && <p className='text-sm font-semibold mr-1 text-blue-400'>Edit</p>}
                        </button>
                        <button className='flex flex-row-reverse items-center text-gray-700 hover:text-green-700 bg-slate-100'>
                          <CircleCheck onMouseEnter={()=> setHoverComplete(true)} onMouseLeave={() => setHoverComplete(false)} onClick={(e) =>handleCompleted(e,task)} />
                          {hoverComplete && <p className='text-sm font-semibold mr-1 text-green-400'>Mark done</p>}
                        </button>
                        <button className='flex flex-row-reverse items-center text-gray-700 hover:text-red-700 bg-slate-100'>
                          <Trash2 onMouseEnter={()=> setHoverDelete(true)} onMouseLeave={() => setHoverDelete(false)} onClick={(e) => handleDeleteTask( e, task._id)} />
                          {hoverDelete && <p className='text-sm font-semibold mr-1 text-red-400'>Delete</p>}
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-gray-700 mt-2">{task.description}</p>
                    <span className="text-gray-500 block mt-3 text-sm">
                      {new Date(task.scheduledAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <span className="absolute top-0 left-[-9px] h-4 w-4 bg-indigo-600 rounded-full"></span>
              </div>
              {index < futureDates.length - 1 && (
                <div className="w-full h-1 border-t border-gray-300 mt-6"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingTasks;
