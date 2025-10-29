import "./App.css";
import {useState} from "react";
import background from "./assets/background.png";
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