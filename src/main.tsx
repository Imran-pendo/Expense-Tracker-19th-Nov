import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Boot the Pendo agent once with an anonymous visitor. The signed-in visitor
// and workspace are registered later with pendo.identify in usePendoIdentity.
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
