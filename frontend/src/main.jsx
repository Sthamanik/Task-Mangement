import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserContextProvider from './contexts/users/UserContextProvider.jsx'
import TasksContextprovider from './contexts/tasks/TasksContextprovider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      {/* <TasksContextprovider> */}
        <App />
      {/* </TasksContextprovider> */}
    </UserContextProvider>
  </StrictMode>,
)
