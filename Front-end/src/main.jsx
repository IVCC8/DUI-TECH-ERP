import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize AOS (Animate On Scroll)
if (window.AOS) {
  window.AOS.init({
    duration: 800,
    once: true,
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
 
