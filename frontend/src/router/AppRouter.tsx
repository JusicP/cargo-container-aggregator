import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Головна сторінка */}
        <Route path="/" element={<HomePage />} />
        
        {/* Аутентифікація */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Мій акаунт */}
        <Route path="/myaccount" element={<MyAccountPage />} />
        <Route path="/myaccount/listings/active" element={<ActiveListingsPage />} />
        <Route path="/myaccount/listings/pending" element={<PendingListingsPage />} />
        <Route path="/myaccount/listings/rejected" element={<RejectedListingsPage />} />
        <Route path="/myaccount/listings/deleted" element={<DeletedListingsPage />} />
        <Route path="/myaccount/profile" element={<ProfilePage />} />
        <Route path="/myaccount/user-settings" element={<UserSettingsPage />} />
        
        {/* Створення оголошення */}
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/create-listing/success" element={<CreateListingSuccessPage />} />
        
        {/* Оголошення */}
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/listing/:id/analytics" element={<ListingAnalyticsPage />} />
        <Route path="/listing/:id/edit" element={<EditListingPage />} />
        
        {/* Адмін панель */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/listings" element={<AdminListingsPage />} />
        <Route path="/admin/parser" element={<AdminParserPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/logs" element={<AdminLogsPage />} />
        
        {/* 404 сторінка для всіх інших маршрутів */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;