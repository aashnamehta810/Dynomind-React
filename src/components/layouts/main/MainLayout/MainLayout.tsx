import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { contentDirection, getRoutePermissionAccessCode } from '@app/utils/utils';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { PermissionTypes, RoutesMapping } from '@app/constants/enums/permission';

const MainLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();
  const translation = useAppSelector((state) => state.translation);
  const location = useLocation();
  const toggleSider = () => setSiderCollapsed(!siderCollapsed);
  const userPermission = useAppSelector((state) => state.user.user?.role.permissions);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      setIsTwoColumnsLayout([DASHBOARD_PATH].includes(location.pathname) && isDesktop);
      if (userPermission) {
        const checkPermission = getRoutePermissionAccessCode(userPermission, RoutesMapping, location.pathname.split('/')[1]);  
        if(!(checkPermission === PermissionTypes.READ || checkPermission === PermissionTypes.READWRITE || location.pathname === DASHBOARD_PATH )) {
          navigate('/accessDenied');
        }
      }
    })();
  }, [location.pathname, isDesktop, userPermission, navigate]);

  return (
    <S.LayoutMaster className={contentDirection(translation.isRtl)}>
      <MainSider isCollapsed={siderCollapsed} setCollapsed={setSiderCollapsed} />
      <S.LayoutMain>
        <MainHeader isTwoColumnsLayout={isTwoColumnsLayout}>
          <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} isTwoColumnsLayout={isTwoColumnsLayout} />
        </MainHeader>
        <MainContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
          <div>
            <Outlet />
          </div>
          {/* {!isTwoColumnsLayout && <References />} */}
        </MainContent>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainLayout;
