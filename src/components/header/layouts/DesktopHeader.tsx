import React from 'react';
import { Col, Row } from 'antd';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { HeaderFullscreen } from '../components/HeaderFullscreen/HeaderFullscreen';
import { UsersDropdown } from '../components/usersDropdown/UsersDropdown';
import * as S from '../Header.styles';
import { PermissionTypes } from '@app/constants/enums/permission';
import { PermissionData } from '@app/interfaces/interfaces';

interface DesktopHeaderProps {
  isTwoColumnsLayout: boolean;
  permissions: PermissionData | undefined;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isTwoColumnsLayout, permissions }) => {
  const leftSide = isTwoColumnsLayout ? (
    <S.SearchColumn xl={16} xxl={17}>
      <Row justify="space-between">
        <Col xl={15} xxl={12}>
          <HeaderSearch />
        </Col>
      </Row>
    </S.SearchColumn>
  ) : (
    <>
      <Col lg={10} xxl={8}>
        <HeaderSearch />
      </Col>
    </>
  );

  return (
    <Row justify="space-between" align="middle">
      {leftSide}

      <S.ProfileColumn xl={8} xxl={7} $isTwoColumnsLayout={isTwoColumnsLayout}>
        <Row align="middle" justify="end" gutter={[10, 10]}>
          <Col>
            <Row gutter={[{ xxl: 10 }, { xxl: 10 }]}>
              {permissions?.users !== PermissionTypes.NOTHING && (
                <Col>
                  <UsersDropdown />
                </Col>
              )}
              <Col>
                <HeaderFullscreen />
              </Col>
              {permissions?.notifications !== PermissionTypes.NOTHING && (
                <Col>
                  <NotificationsDropdown />
                </Col>
              )}
              <Col>
                <SettingsDropdown />
              </Col>
            </Row>
          </Col>
          <Col>
            <ProfileDropdown />
          </Col>
        </Row>
      </S.ProfileColumn>
    </Row>
  );
};
