import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import { LLMPayment } from './pages/LLMPayment'
import { Login } from './pages/Login'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/llm-payment" element={<LLMPayment />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
