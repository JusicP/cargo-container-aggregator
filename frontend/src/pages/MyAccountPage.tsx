import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyAccountPage: React.FC = () => {
  const { user } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'buyer': return 'Покупець';
      case 'seller': return 'Продавець';
      case 'admin': return 'Адміністратор';
      default: return 'Користувач';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Мій акаунт</h1>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem' 
      }}>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Роль:</strong> {getRoleDisplayName(user?.role || '')}</p>
        <p><strong>Статус верифікації:</strong> 
          <span style={{ 
            color: user?.isVerified ? 'green' : 'orange',
            marginLeft: '0.5rem'
          }}>
            {user?.isVerified ? '✅ Підтверджено' : '⚠️ Не підтверджено'}
          </span>
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Link to="/myaccount/profile" style={{ 
          display: 'block', 
          padding: '1rem', 
          background: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          👤 Профіль
        </Link>
        
        <Link to="/myaccount/user-settings" style={{ 
          display: 'block', 
          padding: '1rem', 
          background: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          ⚙️ Налаштування
        </Link>

        {(user?.role === 'buyer' || user?.role === 'seller') && (
          <>
            <Link to="/myaccount/listings/active" style={{ 
              display: 'block', 
              padding: '1rem', 
              background: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              ✅ Активні оголошення
            </Link>
            
            <Link to="/myaccount/listings/pending" style={{ 
              display: 'block', 
              padding: '1rem', 
              background: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              ⏳ На розгляді
            </Link>
          </>
        )}

        {user?.role === 'seller' && (
          <Link to="/create-listing" style={{ 
            display: 'block', 
            padding: '1rem', 
            background: '#28a745', 
            color: 'white',
            textDecoration: 'none', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ➕ Створити оголошення
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link to="/admin" style={{ 
            display: 'block', 
            padding: '1rem', 
            background: '#dc3545', 
            color: 'white',
            textDecoration: 'none', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🔧 Адмін панель
          </Link>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;