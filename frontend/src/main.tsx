import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// connecting Chakra UI library - icons & components
import { Provider } from "@/components/ui/provider"
// configuration i18next
import './i18n/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider>
          <App />
      </Provider>
  </StrictMode>,
)
