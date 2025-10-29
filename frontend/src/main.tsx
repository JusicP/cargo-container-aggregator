import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// connecting Chakra UI library - icons & components
import { Provider } from "@/components/ui/provider"
// configuration i18next
import './i18n/config'
// saving user data locally in the app
import { AuthProvider } from './contexts/AuthContext'
// adding custom alexandria font
import '@fontsource-variable/alexandria/index.css';
// api - query packages
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient({})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <Provider>
              <App />
          </Provider>
      </QueryClientProvider>
  </StrictMode>,
)