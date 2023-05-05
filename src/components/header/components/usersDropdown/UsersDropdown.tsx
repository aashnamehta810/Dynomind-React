import React, { useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Badge } from '@app/components/common/Badge/Badge';
import { UsersOverlay } from '@app/components/header/components/usersDropdown/UsersOverlay/UsersOverlay';
import { HeaderActionWrapper } from '@app/components/header/Header.styles';
import { Popover } from '@app/components/common/Popover/Popover';
import { Modal } from '@app/components/common/Modal/Modal';
import { useDialog } from '@app/hooks/useDialog';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getUserListByRole, setUserDetails } from '@app/store/slices/userSlice';
import { notificationController } from '@app/controllers/notificationController';
import { useNavigate } from 'react-router-dom';
import { checkHTTPStatus } from '@app/utils/utils';
import { RoleTypes } from '@app/constants/enums/roleTypes';
import { UserModel } from '@app/domain/UserModel';

export const UsersDropdown: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserModel>();
  const [isOpened, setOpened] = useState(false);

  useEffect(() => {
    dispatch(
      getUserListByRole({
        role: RoleTypes.USER,
      }),
    )
      .unwrap()
      .then((res) => setUsers(res))
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
      });
  }, [dispatch, navigate]);

  const onSwitchUser = () => {
    if (selectedUser) {
      setUserDetails(selectedUser, dispatch);
    }
    handleDialogClose();
  };

  return (
    <>
      <Popover
        trigger="click"
        content={<UsersOverlay users={users} setSelectedUser={setSelectedUser} handleDialogOpen={handleDialogOpen} />}
        onOpenChange={setOpened}
      >
        <HeaderActionWrapper>
          <Button
            type={isOpened ? 'ghost' : 'text'}
            icon={
              <Badge>
                <UserOutlined />
              </Badge>
            }
          />
        </HeaderActionWrapper>
      </Popover>
      {selectedUser && (
        <Modal title={''} open={dialogOpen} onOk={() => onSwitchUser()} onCancel={() => handleDialogClose()}>
          <p>{`${t('common.switchUserConfirmation')} ${selectedUser?.name}`}</p>
        </Modal>
      )}
    </>
  );
};
