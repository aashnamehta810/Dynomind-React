import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { contentDirection } from '@app/utils/utils';
import { useAppSelector } from '@app/hooks/reduxHooks';

const MainLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const { isDesktop } = useResponsive();
  const translation = useAppSelector((state) => state.translation);
  const location = useLocation();
  const toggleSider = () => setSiderCollapsed(!siderCollapsed);
  const userRoutes = useAppSelector((state) => state.user.user?.role.routes);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      setIsTwoColumnsLayout([DASHBOARD_PATH].includes(location.pathname) && isDesktop);
      if (userRoutes && userRoutes.length) {
        const checkRoute = userRoutes.some((ai) => location.pathname.split('/').includes(ai));
        if (!checkRoute && location.pathname !== DASHBOARD_PATH) {
          navigate('/accessDenied');
        }
      }
    })();
  }, [location.pathname, isDesktop, userRoutes, navigate]);

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
