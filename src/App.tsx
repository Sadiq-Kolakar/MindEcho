import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotesProvider } from './context/NotesContext'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import { LLMPayment } from './pages/LLMPayment'
import { Login } from './pages/Login'
import { NewConcept } from './pages/NewConcept'
import { NotionWorkspace } from './pages/NotionWorkspace'

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/llm-payment" element={<LLMPayment />} />
            <Route path="/concept/new" element={<NewConcept />} />
            <Route path="/workspace" element={<NotionWorkspace />} />
            <Route path="/subjects" element={<NotionWorkspace />} />
          </Routes>
        </BrowserRouter>
      </NotesProvider>
    </AuthProvider>
  )
}
