import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Boot Pendo once with an anonymous visitor. The signed-in user is
// identified later with pendo.identify() in useAuth.
pendo.initialize({
  visitor: {
    id: '',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
