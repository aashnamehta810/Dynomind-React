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
  routeKey: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
  isModel?: boolean;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.dashboard',
    key: 'dashboard',
    routeKey: 'dashboard',
    // TODO use path variable
    url: '/',
    icon: <DashboardOutlined />,
  },
  {
    title: 'common.apps',
    key: 'apps',
    routeKey: 'apps',
    icon: <PlusSquareOutlined />,
    children: [
      {
        title: 'common.createUser',
        key: 'create-user',
        routeKey: 'creatusers',
        url: '/create-user',
        icon: <UserOutlined />,
      },
      {
        title: 'common.users',
        key: 'users',
        routeKey: 'users',
        url: '/list-users',
        icon: <UsergroupAddOutlined />,
      },
      {
        title: 'common.translations',
        key: 'translations',
        routeKey: 'translations',
        url: '/translations',
        icon: <GlobalOutlined />,
      },
      {
        title: 'common.roles',
        key: 'roles',
        routeKey: 'roles',
        url: '/roles',
        icon: <UserSwitchOutlined />,
      },
    ],
  },
  {
    title: 'common.projects',
    key: 'projects',
    routeKey: 'projects',
    icon: <PlusSquareOutlined />,
    children: [
      {
        title: 'common.createProject',
        key: 'create-project',
        routeKey: 'createproject',
        isModel: true,
      },
    ],
  },
];
