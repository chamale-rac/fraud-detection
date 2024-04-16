import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import EmployeeDashboard from './pages/EmployeeDashboard'
import CreateAccount from './pages/CreateAccount'
import CreateClient from './pages/CreateClient'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/about',
    element: <div>About</div>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard/client',
    element: <div>Client Dashboard</div>,
  },
  {
    path: '/employee/dashboard',
    element: <EmployeeDashboard />,
  },
  {
    path: '/employee/client/create',
    element: <CreateClient />,
  },
  {
    path: '/client/account/create',
    element: <CreateAccount />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
