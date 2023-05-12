import React, {useEffect, useMemo, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { sidebarNavigation, SidebarNavigationItem } from '../sidebarNavigation';
import { PermissionComponents, PermissionTypes } from '@app/constants/enums/permission';
import { usePermission } from '@app/hooks/usePermission';
import ProjectMenuOption from '../ProjectMenuOption/ProjectMenuOption';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { ProjectOutlined } from '@ant-design/icons';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
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
  const projectList = useAppSelector((state)=>state.project.projectList);
  const memoizedProjectList = useMemo(() => projectList, [projectList]);
  const [sideNavigation, setSideNavigation] = useState(sidebarNavigation);

  useEffect(() => {
    if (memoizedProjectList) {
      let newProject = memoizedProjectList.results.map((element: SidebarNavigationItem) => {
        return {
          title: element.title,
          key: element.title.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase(),
          icon: <ProjectOutlined/>,
          url: '/kanban',
          isOnlyAdmin: true,
        }
      });

      setSideNavigation(prevState => {
        const projectListToAdd = prevState.findIndex(column => column.title === 'common.projects');
        const updatedProjectList: SidebarNavigationItem = {
          ...prevState[projectListToAdd],
          children: [{
            title: 'common.createProject',
            key: 'create-project',
            isOnlyAdmin: true,
            isModel: true,
          }],
        };
        const updatedSidebarNavigation = prevState.map((item, index) => {
          if (index === projectListToAdd) {
            return updatedProjectList;
          } else {
            return item;
          }
        });
        const existingChildren = updatedProjectList.children || [];
        const updatedChildren = [...existingChildren, ...newProject];
        updatedProjectList.children = updatedChildren;
        return updatedSidebarNavigation;
      });
    }
  }, [memoizedProjectList]);

  return (
    <>
      <S.Menu
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        onClick={() => setCollapsed(true)}
        items={sideNavigation.map((nav) => {
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
                label: !childNav.isModel ? (
                  <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
                ) : (
                  <ProjectMenuOption optionTitle={`${t(childNav.title)}`} />
                ),
                title: t(childNav.title),
                icon: childNav.icon,
              })),
          };
        })}
      />
    </>
  );
};

export default SiderMenu;
