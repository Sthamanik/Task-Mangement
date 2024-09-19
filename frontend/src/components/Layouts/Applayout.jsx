import React, { useContext, useEffect } from 'react'
import Sidebar from './Sidebar'
import image from '../../assets/img/profile.png'
import logo from '../../assets/img/image.png'
import { Routes, useNavigate } from 'react-router-dom'
import Tasklayout from './Tasks/Tasklayout'
import Profile from './Profile'
import { Route } from 'lucide-react'

const Applayout = () => {
  const navigate = useNavigate()

  const capitalize = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const avatar = (user.avatar !== "none") ? user.avatar : image;
  const name = capitalize(user.username);
  useEffect(() => {
    if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
        navigate('/');
    }
  }, [navigate]);
  return (
    <>
    <div className="absolute flex items-center justify-between w-full px-4 py-2">
      <div className='flex items-center space-x-2'>
      <div className='rounded-full h-12 w-12 bg-white'>
              <img src={logo} alt='Profile' className='object-cover rounded-full h-12 w-12'/> 
          </div>
        <p className='text-lg font-bold bg-gradient-to-r from-purple-700 via-blue-800 to-indigo-700 inline-block text-transparent bg-clip-text'> TASKIFY </p>   
      </div>
      <div className='flex flex-row-reverse items-center w-2/3'>
          <div className='rounded-full h-12 w-12 bg-white'>
              <img src={avatar} alt='Profile' className='object-cover rounded-full h-12 w-12'/> 
          </div>
          <p className='mx-5 font-semibold bg-gradient-to-r from-gray-800 via-slate-700 to-black inline-block text-transparent bg-clip-text'>Welcome {name} !!!</p>
      </div>
    </div>
    <div className='h-dvh w-dvw p-16 flex justify-center items-center bg-gradient-to-bl from-slate-500 via-indigo-400 to-cyan-700'>
        <div className='h-full w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-800 flex'>
            <Sidebar/>
            <Routes>
              <Route exact path="/" element={<Tasklayout />} />
              <Route exact path="/profile" element={<Profile />} />
            </Routes>
        </div>
    </div>
    </>
  )
}

export default Applayout
