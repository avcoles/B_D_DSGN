import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Gate the reveal-on-scroll styles behind a class set from JS. If the script
// fails to run, `.reveal { opacity: 0 }` never applies and the page still reads.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
