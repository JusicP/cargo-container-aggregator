import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Реєстрація</h1>
      <p>Сторінка реєстрації (заглушка)</p>
      <Link to="/login">Увійти</Link>
    </div>
  );
};

export default RegisterPage;
