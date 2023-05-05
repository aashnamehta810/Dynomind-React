import React from 'react';
import { DesktopHeader } from './layouts/DesktopHeader';
import { MobileHeader } from './layouts/MobileHeader';
import { useResponsive } from '@app/hooks/useResponsive';
import { usePermission } from '@app/hooks/usePermission';
import { PermissionComponents } from '@app/constants/enums/permission';
interface HeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
  isTwoColumnsLayout: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSider, isSiderOpened, isTwoColumnsLayout }) => {
  const { isTablet } = useResponsive();
  const userNotificationPermission = usePermission(PermissionComponents.NOTIFICATION);
  const createUserPermission = usePermission(PermissionComponents.CREATEUSER);
  return isTablet ? (
    <DesktopHeader
      isTwoColumnsLayout={isTwoColumnsLayout}
      notificationPermission={userNotificationPermission}
      createUserPermission={createUserPermission}
    />
  ) : (
    <MobileHeader
      toggleSider={toggleSider}
      isSiderOpened={isSiderOpened}
      notificationPermission={userNotificationPermission}
      createUserPermission={createUserPermission}
    />
  );
};
