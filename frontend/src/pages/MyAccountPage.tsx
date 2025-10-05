import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyAccountPage: React.FC = () => {
  const { user } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'user': return 'Користувач';
      case 'admin': return 'Адміністратор';
      case 'guest': return 'Гість';
      default: return 'Користувач';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '✅ Активний';
      case 'INACTIVE': return '⚠️ Неактивний';
      case 'BANNED': return '🚫 Заблокований';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Мій акаунт</h1>
      <div style={{ 
        background: 'rgba(0,0,0,0.1)', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem' 
      }}>
        <p><strong>Ім'я:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Телефон:</strong> {user?.phone_number}</p>
        {user?.company_name && (
          <p><strong>Компанія:</strong> {user.company_name}</p>
        )}
        <p><strong>Роль:</strong> {getRoleDisplayName(user?.role || '')}</p>
        <p><strong>Статус:</strong> {getStatusDisplayName(user?.status || '')}</p>
        <p><strong>Дата реєстрації:</strong> {user?.registration_date ? new Date(user.registration_date).toLocaleDateString('uk-UA') : '-'}</p>
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

        {/* Користувачі можуть і продавати, і купляти */}
        {user?.role === 'user' && (
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
          </>
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