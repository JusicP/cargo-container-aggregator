import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

// Імпорти компонентів сторінок
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyAccountPage from '../pages/MyAccountPage';
import ActiveListingsPage from '../pages/myaccount/ActiveListingsPage';
import PendingListingsPage from '../pages/myaccount/PendingListingsPage';
import RejectedListingsPage from '../pages/myaccount/RejectedListingsPage';
import DeletedListingsPage from '../pages/myaccount/DeletedListingsPage';
import ProfilePage from '../pages/myaccount/ProfilePage';
import UserSettingsPage from '../pages/myaccount/UserSettingsPage';
import CreateListingPage from '../pages/CreateListingPage';
import CreateListingSuccessPage from '../pages/CreateListingSuccessPage';
import ListingPage from '../pages/ListingPage';
import ListingAnalyticsPage from '../pages/ListingAnalyticsPage';
import EditListingPage from '../pages/EditListingPage';
import AdminPage from '../pages/AdminPage';
import AdminListingsPage from '../pages/admin/AdminListingsPage';
import AdminParserPage from '../pages/admin/AdminParserPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminLogsPage from '../pages/admin/AdminLogsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouterContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Головна сторінка - доступна всім */}
      <Route path="/" element={<HomePage />} />
      
      {/* Аутентифікація - доступна тільки неавторизованим користувачам */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        } 
      />
      
      {/* Мій акаунт - доступний тільки авторизованим користувачам */}
      <Route 
        path="/myaccount" 
        element={
          <ProtectedRoute>
            <MyAccountPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Оголошення в акаунті - доступні тільки покупцям і продавцям */}
      <Route 
        path="/myaccount/listings/active" 
        element={
          <ProtectedRoute requiredRoles={['buyer', 'seller']}>
            <ActiveListingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/myaccount/listings/pending" 
        element={
          <ProtectedRoute requiredRoles={['buyer', 'seller']}>
            <PendingListingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/myaccount/listings/rejected" 
        element={
          <ProtectedRoute requiredRoles={['buyer', 'seller']}>
            <RejectedListingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/myaccount/listings/deleted" 
        element={
          <ProtectedRoute requiredRoles={['buyer', 'seller']}>
            <DeletedListingsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Профіль і налаштування - доступні всім авторизованим користувачам */}
      <Route 
        path="/myaccount/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/myaccount/user-settings" 
        element={
          <ProtectedRoute>
            <UserSettingsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Створення оголошення - тільки для продавців з верифікацією */}
      <Route 
        path="/create-listing" 
        element={
          <ProtectedRoute 
            requiredRoles={['seller']} 
            requireVerification={true}
          >
            <CreateListingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-listing/success" 
        element={
          <ProtectedRoute requiredRoles={['seller']}>
            <CreateListingSuccessPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Перегляд оголошення - доступний всім */}
      <Route path="/listing/:id" element={<ListingPage />} />
      
      {/* Аналітика оголошення - тільки для власника оголошення або адмінів */}
      <Route 
        path="/listing/:id/analytics" 
        element={
          <ProtectedRoute requiredRoles={['seller', 'admin']}>
            <ListingAnalyticsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Редагування оголошення - тільки для власника оголошення або адмінів */}
      <Route 
        path="/listing/:id/edit" 
        element={
          <ProtectedRoute requiredRoles={['seller', 'admin']}>
            <EditListingPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Адмін панель - тільки для адміністраторів */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/listings" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminListingsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/parser" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminParserPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/logs" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminLogsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 сторінка для всіх інших маршрутів */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
};

export default AppRouter;