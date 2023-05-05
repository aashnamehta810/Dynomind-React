import React, { useEffect, useState } from 'react';
import { Avatar, Col, Row } from 'antd';
import { H6 } from '@app/components/common/typography/H6/H6';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';
import { Popover } from '@app/components/common/Popover/Popover';
import { capitalize } from '@app/utils/utils';
import avatarImg from '@app/assets/images/avatar.webp';

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();
  const [imageURl, setImageURL] = useState('');

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user) setImageURL(user.image && user.image.signedURL ? user.image.signedURL : avatarImg);
  }, [user]);

  return user ? (
    <Popover content={<ProfileOverlay />} trigger="click">
      <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle" className="rtl-reverse">
        <Col>
          <Avatar src={imageURl} alt="User" shape="circle" size={40} />
        </Col>
        {isTablet && (
          <Col>
            <H6>{capitalize(`${user.name}`)}</H6>
          </Col>
        )}
      </S.ProfileDropdownHeader>
    </Popover>
  ) : null;
};
