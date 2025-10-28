import React from 'react';
import AppRouter from './router/AppRouter';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <AppRouter />
    </div>
  );
};

export default App;