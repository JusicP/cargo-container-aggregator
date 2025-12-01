import "./App.css";
import './index.css'
import AppRouter from '@/router/AppRouter';
import Navbar from "@/router/Navbar.tsx"
import Footer from "@/router/Footer.tsx"

const App: React.FC = () => {
  return (
      <>
          <Navbar />
          <div className="app-container">
              <AppRouter />
          </div>
      </>
  );
};

export default App;