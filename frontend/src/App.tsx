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
import Candidates from './pages/admin/Candidates'
import Staff from './pages/admin/Staff'
import ExamSessions from './pages/admin/ExamSessions'
import Workstations from './pages/admin/Workstations'
import { RequireAuth } from './components/RequireAuth'
import { RequireRole } from './components/RequireRole'
import './App.css'

const adminRoles = ["super_admin", "administrator", "examination_officer"];

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
      <Route path="/admin" element={<RequireRole roles={adminRoles}><Dashboard /></RequireRole>} />
      <Route path="/admin/candidates" element={<RequireRole roles={adminRoles}><Candidates /></RequireRole>} />
      <Route path="/admin/sessions" element={<RequireRole roles={adminRoles}><ExamSessions /></RequireRole>} />
      <Route path="/admin/workstations" element={<RequireRole roles={adminRoles}><Workstations /></RequireRole>} />
      <Route path="/admin/staff" element={<RequireRole roles={["super_admin"]}><Staff /></RequireRole>} />
    </Routes>
  )
}

export default App