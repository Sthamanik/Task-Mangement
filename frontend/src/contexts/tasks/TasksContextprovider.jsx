import React from 'react'
import TasksContext from './TasksContext'

const TasksContextprovider = (children) => {
  const server = import.meta.env.VITE_HOST;

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}

export default TasksContextprovider
