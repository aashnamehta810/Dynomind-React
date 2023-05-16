import React from 'react';
import { DesktopHeader } from './layouts/DesktopHeader';
import { MobileHeader } from './layouts/MobileHeader';
import { useResponsive } from '@app/hooks/useResponsive';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface HeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
  isTwoColumnsLayout: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSider, isSiderOpened, isTwoColumnsLayout }) => {
  const { isTablet } = useResponsive();
  const userPermissions = useAppSelector((state) => state.user.user?.role.permissions);
  return isTablet ? (
    <DesktopHeader
      isTwoColumnsLayout={isTwoColumnsLayout}
      notificationPermission={userPermissions?.notifications}
      createUserPermission={userPermissions?.users}
    />
  ) : (
    <MobileHeader
      toggleSider={toggleSider}
      isSiderOpened={isSiderOpened}
      notificationPermission={userPermissions?.notifications}
      createUserPermission={userPermissions?.users}
    />
  );
};
