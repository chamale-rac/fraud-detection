import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing, Login, SignUp, Admin, Layout, Users } from '@Pages'
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
          <Route path="/app" element={<Layout />}>
            <Route>
              <Route path="/app/transactions" element={<>transactions</>} />
              <Route path="/app/transfers" element={<>transfers</>} />
              <Route path="/app/banks" element={<>Banks</>} />
              <Route path="/app/Users" element={<Users />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
