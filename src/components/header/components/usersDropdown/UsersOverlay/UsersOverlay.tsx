import React, { useMemo } from 'react';
import { Avatar, Col, Row } from 'antd';
import { capitalize } from 'utils/utils';
import * as S from './UsersOverlay.styles';
import { UserModel } from '@app/domain/UserModel';
import avatarImg from '@app/assets/images/avatar.webp';

interface UsersOverlayProps {
  users: UserModel[];
  setSelectedUser: (state: UserModel) => void;
  handleDialogOpen: () => void;
}

export const UsersOverlay: React.FC<UsersOverlayProps> = ({ users, setSelectedUser, handleDialogOpen, ...props }) => {
  const usersOptions = useMemo(
    () =>
      users.map((user) => {
        const currentUser = users.find((userDetails) => userDetails.id === user.id);
        return (
          <S.DropDownContent
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              handleDialogOpen();
            }}
          >
            <Row>
              <Col span={4}>
                <Avatar
                  src={user.image && user.image.signedURL ? user.image.signedURL : avatarImg}
                  alt="User"
                  shape="circle"
                  size={40}
                />
              </Col>
              <Col span={20}>
                <S.Text>{capitalize(currentUser?.firstname || '')}</S.Text>
              </Col>
            </Row>
            <S.ItemsDivider />
          </S.DropDownContent>
        );
      }),
    [users, setSelectedUser, handleDialogOpen],
  );

  return <S.UsersOverlayMenu {...props}>{usersOptions}</S.UsersOverlayMenu>;
};
