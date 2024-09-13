import React from 'react'
import Sidebar from './Sidebar'

const Applayout = () => {
  return (
    <div className='h-svh w-svw p-10 flex justify-center items-center bg-gradient-to-bl from-slate-500 via-indigo-400 to-cyan-700'>
        <div className='h-full w-full bg-white bg-opacity-15 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl shadow-indigo-800 flex'>
            <Sidebar/>
        </div>
    </div>
  )
}

export default Applayout
