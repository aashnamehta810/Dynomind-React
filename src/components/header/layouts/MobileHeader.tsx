import React from 'react';
import { Col, Row } from 'antd';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { UsersDropdown } from '../components/usersDropdown/UsersDropdown';
import * as S from '../Header.styles';
import { PermissionTypes } from '@app/constants/enums/permission';
interface MobileHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
  notificationPermission: number | undefined;
  createUserPermission: number | undefined;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  toggleSider,
  isSiderOpened,
  notificationPermission,
  createUserPermission,
}) => {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <ProfileDropdown />
      </Col>

      <Col>
        <Row align="middle">
          {createUserPermission !== PermissionTypes.NOTHING && (
            <Col>
              <UsersDropdown />
            </Col>
          )}
          {notificationPermission !== PermissionTypes.NOTHING && (
            <Col>
              <NotificationsDropdown />
            </Col>
          )}
          <Col>
            <HeaderSearch />
          </Col>

          <Col>
            <SettingsDropdown />
          </Col>
        </Row>
      </Col>

      <S.BurgerCol>
        <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
      </S.BurgerCol>
    </Row>
  );
};
