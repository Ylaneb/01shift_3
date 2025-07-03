import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext'
import './i18n';
import i18n, { setDirection } from './i18n';

// Set initial direction
setDirection(i18n.language);
i18n.on('languageChanged', setDirection);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
