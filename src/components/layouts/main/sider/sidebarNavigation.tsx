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
  isModel?: boolean;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    // TODO use path variable
    url: '/',
    icon: <DashboardOutlined />,
  },
  {
    title: 'common.apps',
    key: 'apps',
    icon: <PlusSquareOutlined />,
    children: [
      {
        title: 'common.createUser',
        key: 'create-user',
        url: '/create-user',
        icon: <UserOutlined />,
      },
      {
        title: 'common.users',
        key: 'users',
        url: '/list-users',
        icon: <UsergroupAddOutlined />,
      },
      {
        title: 'common.translations',
        key: 'translations',
        url: '/translations',
        icon: <GlobalOutlined />,
      },
      {
        title: 'common.roles',
        key: 'roles',
        url: '/roles',
        icon: <UserSwitchOutlined />,
      },
    ],
  },
  {
    title: 'common.projects',
    key: 'projects',
    icon: <PlusSquareOutlined />,
    children: [
      {
        title: 'common.createProject',
        key: 'create-project',
        isModel: true,
      },
    ],
  },
];
