import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { sidebarNavigation, SidebarNavigationItem } from '../sidebarNavigation';
import { PermissionComponents, PermissionTypes } from '@app/constants/enums/permission';
import { usePermission } from '@app/hooks/usePermission';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  // const user = useAppSelector((state) => state.user.user);
  const createUserPermission = usePermission(PermissionComponents.CREATEUSER);
  const { t } = useTranslation();
  const location = useLocation();
  const sidebarNavigates = sidebarNavigation.filter((item) => {
    return createUserPermission !== PermissionTypes.NOTHING ? item : !item.isOnlyAdmin;
  });
  const sidebarNavFlat = sidebarNavigates.reduce(
    (result: SidebarNavigationItem[], current) =>
      result.concat(current.children && current.children.length > 0 ? current.children : current),
    [],
  );

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigates.find(({ children }) => children?.some(({ url }) => url === location.pathname));
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
      items={sidebarNavigates.map((nav) => {
        const isSubMenu = nav.children?.length;

        return {
          key: nav.key,
          title: t(nav.title),
          label: isSubMenu ? t(nav.title) : <Link to={nav.url || ''}>{t(nav.title)}</Link>,
          icon: nav.icon,
          children:
            isSubMenu &&
            nav.children &&
            nav.children.map((childNav) => ({
              key: childNav.key,
              label: <Link to={childNav.url || ''}>{t(childNav.title)}</Link>,
              title: t(childNav.title),
              icon: childNav.icon,
            })),
        };
      })}
    />
  );
};

export default SiderMenu;
