import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'modern-normalize';
import './styles/global.scss';
import App from './components/app/App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
