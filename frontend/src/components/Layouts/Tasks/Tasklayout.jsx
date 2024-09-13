import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PendingTasks from './PendingTasks'
import Completed from './Completed'
import Archived from './Archived'

const Tasklayout = () => {
  return (
    <div className='w-full h-full'>
      <Routes>
        <Route path='/' element={<PendingTasks />} />
        <Route path='/completed' element={<Completed />} />
        <Route path='/archived' element={<Archived />} />
      </Routes>
    </div>
  )
}

export default Tasklayout
