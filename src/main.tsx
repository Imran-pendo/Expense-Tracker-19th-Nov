import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Boot Pendo once with an anonymous visitor. The signed-in visitor is
// identified later in AuthProvider (src/app/providers.tsx).
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
