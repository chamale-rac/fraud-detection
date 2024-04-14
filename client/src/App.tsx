import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@Pages'

// const viteLogo = '/vite.svg'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<>Login</>} />
        <Route path="/signup" element={<>Sign up</>} />
        <Route path="/app" element={<>App</>}>
          <Route>
            <Route path="/app/dashboard" element={<>Dashboard</>} />
            <Route path="/app/profile" element={<>Profile</>} />
            <Route path="/app/settings" element={<>Settings</>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
