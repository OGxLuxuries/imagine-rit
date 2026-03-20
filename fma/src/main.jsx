import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mock window.storage for local testing (emulates Imagine RIT environment)
if (!window.storage) {
  window.storage = {
    get: async (key, persistent = false) => {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    },
    set: async (key, value, persistent = false) => {
      localStorage.setItem(key, value);
    }
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
