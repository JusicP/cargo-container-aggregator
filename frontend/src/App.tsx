import "./App.css";
import './index.css'
import AppRouter from './router/AppRouter';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
};

export default App;