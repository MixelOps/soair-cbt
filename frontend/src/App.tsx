import { Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Services from './pages/public/Services'
import ExamCalendar from './pages/public/ExamCalendar'
import Contact from './pages/public/Contact'
import Register from './pages/public/Register'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/calendar" element={<ExamCalendar />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App