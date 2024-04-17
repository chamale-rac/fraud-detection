import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App"
import Login from "./pages/Login"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import CreateAccount from "./pages/CreateAccount"
import CreateClient from "./pages/CreateClient"
import ClientTransaction from "./pages/ClientTransaction"
import Client from "./pages/Client"
import Cash from "./pages/Cash"
import Employee from "./pages/Employee"
import Admin from "./pages/Admin"
import MyAccounts from "./pages/MyAccounts"
import Clients from "./pages/Clients"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "/admin/dashboard", element: <div>Admin dashboard</div> },
    ],
  },
  {
    path: "/client",
    element: <Client />,
    children: [
      { path: "/client/dashboard", element: <div>Dashboard</div> },
      { path: "/client/account", element: <CreateAccount /> },
      { path: "/client/my_accounts", element: <MyAccounts /> },
      { path: "/client/transaction", element: <ClientTransaction /> },
    ],
  },
  {
    path: "/employee",
    element: <Employee />,
    children: [
      { path: "/employee/dashboard", element: <EmployeeDashboard /> },
      { path: "/employee/create", element: <CreateClient /> },
      { path: "/employee/client", element: <Clients /> },
      { path: "/employee/cash", element: <Cash /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
