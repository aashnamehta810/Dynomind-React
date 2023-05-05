import React from 'react';
import {
  DashboardOutlined,
  GlobalOutlined,
  UserOutlined,
  PlusSquareOutlined,
  UserSwitchOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
  isOnlyAdmin: boolean;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    // TODO use path variable
    url: '/',
    icon: <DashboardOutlined />,
    isOnlyAdmin: false,
  },
  {
    title: 'common.apps',
    key: 'apps',
    icon: <PlusSquareOutlined />,
    isOnlyAdmin: true,
    children: [
      {
        title: 'common.createUser',
        key: 'create-user',
        url: '/create-user',
        icon: <UserOutlined />,
        isOnlyAdmin: true,
      },
      {
        title: 'common.users',
        key: 'users',
        url: '/list-users',
        icon: <UsergroupAddOutlined />,
        isOnlyAdmin: true,
      },
      {
        title: 'common.translations',
        key: 'translations',
        url: '/translations',
        icon: <GlobalOutlined />,
        isOnlyAdmin: true,
      },
      {
        title: 'common.roles',
        key: 'roles',
        url: '/roles',
        icon: <UserSwitchOutlined />,
        isOnlyAdmin: true,
      },
    ],
  },
];
