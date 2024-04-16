import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing, Login, SignUp, Admin, EmployeeLayout, Users } from '@Pages'
import { Toaster } from '@/components/ui/toaster'

// const viteLogo = '/vite.svg'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route>
              <Route path="/employee/users" element={<Users />} />
              <Route path="/employee/dashboard">"Dashboard"</Route>
            </Route>
          </Route>
          <Route path="/client" element={<EmployeeLayout />}>
            <Route>
              <Route path="/client/Users" element={<Users />} />
              <Route path="/client/dashboard">"Dashboard"</Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
