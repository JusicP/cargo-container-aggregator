import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// connecting Chakra UI library - icons & components
import { Provider } from "@/components/ui/provider"
// adding custom alexandria font
import '@fontsource-variable/alexandria/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider>
          <App />
      </Provider>
  </StrictMode>,
)
