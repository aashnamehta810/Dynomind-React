import React from 'react';
import { Col, Row } from 'antd';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { UsersDropdown } from '../components/usersDropdown/UsersDropdown';
import * as S from '../Header.styles';
import { PermissionTypes } from '@app/constants/enums/permission';
import { PermissionData } from '@app/interfaces/interfaces';

interface MobileHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
  permissions: PermissionData | undefined;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSider, isSiderOpened, permissions }) => {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <ProfileDropdown />
      </Col>

      <Col>
        <Row align="middle">
          {permissions?.users !== PermissionTypes.NOTHING && (
            <Col>
              <UsersDropdown />
            </Col>
          )}
          {permissions?.notifications !== PermissionTypes.NOTHING && (
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
