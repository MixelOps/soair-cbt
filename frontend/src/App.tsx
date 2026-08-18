import { Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Services from './pages/public/Services'
import ExamCalendar from './pages/public/ExamCalendar'
import Contact from './pages/public/Contact'
import Register from './pages/public/Register'
import Login from './pages/public/Login'
import Signup from './pages/public/Signup'
import Dashboard from './pages/admin/Dashboard'
import { RequireAuth } from './components/RequireAuth'
import { RequireRole } from './components/RequireRole'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/calendar" element={<ExamCalendar />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<RequireAuth><Register /></RequireAuth>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<RequireRole roles={["super_admin", "administrator", "examination_officer"]}><Dashboard /></RequireRole>} />
    </Routes>
  )
}

export default App