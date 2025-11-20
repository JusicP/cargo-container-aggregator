import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAuth = true,
}) => {
  return <>{children}</>;
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('ProtectedRoute check:', { user, isAuthenticated, isLoading, requiredRoles }); 

  // Показуємо спіннер під час завантаження
  if (isLoading) {
    console.log('Still loading...'); 
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Завантаження...</p>
      </div>
    );
  }

  // Якщо потрібна авторизація, але користувач не авторизований
  if (requireAuth && !isAuthenticated) {
    console.log('Not authenticated, redirecting to login'); 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Якщо користувач авторизований, але немає доступу за роллю
  if (isAuthenticated && user && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="verification-container">
        <h2 className="verification-title">
          Немає доступу
        </h2>
        <p className="verification-description">
          У вас немає необхідних прав для доступу до цієї сторінки.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Повернутися назад
        </button>
      </div>
    );
  }

  // Якщо всі перевірки пройдені, показуємо контент
  return <>{children}</>;
};

export default ProtectedRoute;