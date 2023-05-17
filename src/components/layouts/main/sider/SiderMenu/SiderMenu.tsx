import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { sidebarNavigation, SidebarNavigationItem } from '../sidebarNavigation';
import { PermissionTypes } from '@app/constants/enums/permission';
import ProjectMenuOption from '../ProjectMenuOption/ProjectMenuOption';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { ProjectOutlined } from '@ant-design/icons';
import { getProjectList } from '@app/store/slices/projectSlice';
import { capitalize, getAccessCode } from '@app/utils/utils';
import { Project } from '@app/api/project.api';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const sidebarNavFlat = sidebarNavigation.reduce(
    (result: SidebarNavigationItem[], current) =>
      result.concat(current.children && current.children.length > 0 ? current.children : current),
    [],
  );

  const [sideNavigation, setSideNavigation] = useState(sidebarNavigation);

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];
  const openedSubmenu = sidebarNavigation.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname),
  );
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];
  const projectList = useAppSelector((state) => state?.project.projectList);
  const userPermission = useAppSelector((state) => state?.user?.user?.role?.permissions);
  const memoizedProjectList = useMemo(() => projectList, [projectList]);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  useEffect(() => {
    if (userPermission) {
      const permissionNavigation = sidebarNavigation
        .map((item) => {
          if (!item.children) {
            return item;
          }
          const filteredChildren = item.children.filter((child) => {
            return getAccessCode(userPermission, child.routeKey) !== PermissionTypes.NOTHING;
          });
          if (filteredChildren.length === 0) {
            return null;
          }
          return {
            ...item,
            children: filteredChildren,
          };
        })
        .filter((item) => item);
      setSideNavigation(permissionNavigation as SidebarNavigationItem[]);

      if (memoizedProjectList) {
        const newProject = memoizedProjectList.map((element: Project) => {
          return {
            title: element.title,
            key: `projects-${element.id}`,
            routeKey: 'createproject',
            icon: <ProjectOutlined />,
            url: `${'/projects'}/${element.id}`,
          };
        });
        setSideNavigation((prevState) => {
          const projectListToAdd = prevState.findIndex((column) => column.title === 'common.projects');
          const updatedProjectList: SidebarNavigationItem = {
            ...prevState[projectListToAdd],
            children: [
              {
                title: 'common.createProject',
                key: 'create-project',
                routeKey: 'createproject',
                isModel: true,
              },
            ],
          };
          const updatedSidebarNavigation: SidebarNavigationItem[] = prevState.map((item, index) => {
            if (index === projectListToAdd) {
              return updatedProjectList;
            } else {
              return item;
            }
          });
          const existingChildren = updatedProjectList.children || [];
          const updatedChildren = [...newProject, ...existingChildren];
          updatedProjectList.children = updatedChildren;
          return updatedSidebarNavigation;
        });
      }
    }
  }, [memoizedProjectList, userPermission]);

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
            label: isSubMenu ? capitalize(t(nav.title)) : <Link to={nav.url || ''}>{capitalize(t(nav.title))}</Link>,
            icon: nav.icon,
            children:
              isSubMenu &&
              nav.children &&
              nav.children.map((childNav) => ({
                key: childNav.key,
                label: !childNav.isModel ? (
                  <Link to={childNav.url || ''}>{capitalize(t(childNav.title))}</Link>
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
