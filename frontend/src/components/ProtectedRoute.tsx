import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireAuth?: boolean;
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAuth = true,
  requireVerification = false
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Показуємо спіннер під час завантаження
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Завантаження...</p>
      </div>
    );
  }

  // Якщо потрібна авторизація, але користувач не авторизований
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Якщо користувач авторизований, але немає доступу за роллю
  if (isAuthenticated && user && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Якщо потрібна верифікація, але користувач не верифікований
  if (requireVerification && user && !user.isVerified) {
    return (
      <div className="verification-container">
        <h2 className="verification-title">
          Підтвердження облікового запису
        </h2>
        <p className="verification-description">
          Для доступу до цієї сторінки необхідно підтвердити ваш обліковий запис через email.
        </p>
        <p className="verification-hint">
          Перевірте вашу пошту та перейдіть за посиланням для підтвердження.
        </p>
      </div>
    );
  }

  // Якщо всі перевірки пройдені, показуємо контент
  return <>{children}</>;
};

export default ProtectedRoute;