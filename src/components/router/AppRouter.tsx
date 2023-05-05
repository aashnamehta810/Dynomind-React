import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import SignUpPage from '@app/pages/SignUpPage';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import SecurityCodePage from '@app/pages/SecurityCodePage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
import DashboardPage from '@app/pages/DashboardPages/DashboardPage';
import TranslationPage from '@app/pages/TranslationPage';
import RolesPage from '@app/pages/RolesPage';
import ListUsersPage from '@app/pages/ListUsersPage';

const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));
const SecuritySettingsPage = React.lazy(() => import('@app/pages/SecuritySettingsPage'));
const NotificationsPage = React.lazy(() => import('@app/pages/NotificationsPage'));
const CreateUserFormPage = React.lazy(() => import('@app/pages/CreateUserFormPage'));
const AccessDeniedPage = React.lazy(() => import('@app/pages/AccessDeniedPage'));
const Logout = React.lazy(() => import('./Logout'));

export const DASHBOARD_PATH = '/';

const Dashboard = withLoading(DashboardPage);
const CreateUserForm = withLoading(CreateUserFormPage);
const Translation = withLoading(TranslationPage);
const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);
const AccessDenied = withLoading(AccessDeniedPage);
const ListUsers = withLoading(ListUsersPage);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);
const SecuritySettings = withLoading(SecuritySettingsPage);
const Notifications = withLoading(NotificationsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

const Router = () => {
  const routes = [
    {
      path: DASHBOARD_PATH,
      element: (
        <RequireAuth>
          <MainLayout />
        </RequireAuth>
      ),
      children: [
        { path: DASHBOARD_PATH, element: <Dashboard /> },
        {
          path: 'create-user',
          element: <CreateUserForm />,
        },
        {
          path: 'list-users',
          element: <ListUsers />,
        },
        {
          path: 'translations',
          element: <Translation />,
        },
        {
          path: 'roles',
          element: <RolesPage />,
        },
        {
          path: 'server-error',
          element: <ServerError />,
        },
        {
          path: '404',
          element: <Error404 />,
        },
        {
          path: 'profile',
          element: <ProfileLayout />,
          children: [
            {
              path: 'personal-info',
              element: <PersonalInfo />,
            },
            {
              path: 'security-settings',
              element: <SecuritySettings />,
            },
            {
              path: 'notifications',
              element: <Notifications />,
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      element: <AuthLayoutFallback />,
      children: [
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'sign-up',
          element: <SignUpPage />,
        },
        {
          path: 'lock',
          element: (
            <RequireAuth>
              <LockPage />
            </RequireAuth>
          ),
        },
        {
          path: 'forgot-password',
          element: <ForgotPasswordPage />,
        },
        {
          path: 'security-code',
          element: <SecurityCodePage />,
        },
        {
          path: 'new-password',
          element: <NewPasswordPage />,
        },
      ],
    },
    {
      path: '/logout',
      element: <LogoutFallback />,
    },
    {
      path: '/accessDenied',
      element: <AccessDenied />,
    },
  ];

  const element = useRoutes(routes);

  return element;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};
