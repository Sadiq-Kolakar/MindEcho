import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyTheme } from './context/ThemeContext'
import './index.css'

const storedTheme = localStorage.getItem('memoroute_theme')
if (storedTheme === 'monochrome') {
  applyTheme('monochrome')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
