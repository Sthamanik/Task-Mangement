import { AlertCircle, CheckCircle, ChevronsRight, Logs, Menu, PackageOpen, PlusSquare, Power, Search, Settings, UserCircle } from 'lucide-react'
import React, { useContext} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserContext from "../../contexts/users/UserContext";

const Sidebar = ({openTaskPanel, tasks}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useContext(UserContext);
  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
        const result = await logoutUser();
        if (result.success) {
            navigate('/')
        }
    } catch (error) {
      console.error('Failed to log out user:', error)
    }

  }
  return (
    <div className='flex flex-col justify-between h-full rounded-l-2xl bg-slate-300 md:w-1/5 py-2 px-3'>
      <div>
        <div className='mb-4 flex items-center justify-between'>
          <p className='text-xl font-bold tracking-wide'>Menu</p>
          <Menu className='hover:text-slate-500'/>
        </div>
        <div className='relative flex items-center mb-4'>
          <input
            type="search"
            name=""
            id=""
            className='w-full h-8 rounded-full p-2 pr-10 text-black focus:outline-none'
            placeholder='Search...'
          />
          <Search className='absolute right-3 text-gray-600 hover:text-black hover:cursor-pointer' />
        </div>
        <Link to="/app/profile" className='flex space-x-2 mb-2 text-gray-700 hover:text-black'>
          <UserCircle/>
          <p className="font-semibold tracking-wide">Profile</p>
        </Link>
        <div className='flex space-x-2 mb-2'>
          <Logs/>
          <p className="font-semibold tracking-wide text-gray-700 hover:text-black">Tasks</p>
        </div>
        <hr className='border-3 border-black mb-3'/>
        <div className='flex flex-col space-y-2'>
        <Link to="#" className='flex justify-between items-center text-gray-700 hover:text-cyan-600'  onClick={() => openTaskPanel()}>
            <div className='flex space-x-2'>
              <PlusSquare/>
              <p className='font-semibold tracking-wide'>Add new task</p>
            </div>
            <ChevronsRight/>
          </Link>
          <Link to="/app/tasks/pending" className={`flex justify-between items-center ${location.pathname === '/app/tasks/pending' ?'text-red-600' :' text-gray-700  hover:text-red-600 '} `}>
            <div className='flex space-x-2'>
              <AlertCircle/>
              <p className='font-semibold tracking-wide'>Pending</p>
            </div>
            <div className='h-7 w-7 bg-red-600 rounded-full flex items-center justify-center'>
              <p className='font-bold text-slate-300'>{tasks.pending}</p>
            </div>
          </Link>
          <Link to="/app/tasks/completed" className={`flex justify-between items-center ${location.pathname === '/app/tasks/completed' ?'text-green-600' :' text-gray-700  hover:text-green-600 '} `}>
            <div className='flex space-x-2'>
              <CheckCircle/>
              <p className='font-semibold tracking-wide'>Completed</p>
            </div>
            <div className='h-7 w-7 bg-green-600 rounded-full flex items-center justify-center'>
              <p className='font-bold text-slate-300'>{tasks.completed}</p>
            </div>
          </Link>
          <Link to="/app/tasks/archived" className={`flex justify-between items-center ${location.pathname === '/app/tasks/archived' ?'text-blue-600' :' text-gray-700  hover:text-blue-600 '} `}>
            <div className='flex space-x-2'>
              <PackageOpen/>
              <p className='font-semibold tracking-wide'>Archived</p>
            </div>
            <div className='h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center'>
              <p className='font-bold text-slate-300'>{tasks.archived}</p>
            </div>
          </Link>
        </div>
      </div>
      <section className='py-4 text-gray-700 space-y-2'>
        <Link to="#" className='flex space-x-2 hover:text-black font-bold'>
          <Settings/>
          <p>Settings</p>
        </Link>
        <button 
          className='flex space-x-2 hover:text-black font-bold'
          onClick={handleLogOut}
        >
          <Power/>
          <p>Logout</p>
        </button>
      </section>
    </div>
  )
}

export default Sidebar
