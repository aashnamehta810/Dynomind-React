import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { ConfirmItemPassword } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/ConfirmPasswordItem/ConfirmPasswordItem';
import { CurrentPasswordItem } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/CurrentPasswordItem/CurrentPasswordItem';
import { NewPasswordItem } from '@app/components/profile/profileCard/profileFormNav/nav/SecuritySettings/passwordForm/NewPasswordItem/NewPasswordItem';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './PasswordForm.styles';
import { doUpdateUserProfile } from '@app/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
interface changePassword {
  newPassword: string;
  password: string;
  confirmPassword: string;
}

export const PasswordForm: React.FC = () => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onFinish = (values: changePassword) => {
    setLoading(true);
    const payload = {
      userDetails: {
        password: values?.password,
      },
      userId: user?.id || '',
    };

    dispatch(doUpdateUserProfile(payload))
      .unwrap()
      .then(() => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({
          message: t('alerts.successUpdateProfile'),
        });
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <BaseButtonsForm
      name="newPassword"
      requiredMark="optional"
      isFieldsChanged={isFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      footer={
        <S.Btn loading={isLoading} type="primary" htmlType="submit">
          {t('common.confirm')}
        </S.Btn>
      }
      onFinish={onFinish}
    >
      <Row gutter={{ md: 15, xl: 30 }}>
        <Col span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('profile.nav.securitySettings.changePassword')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </Col>

        <Col xs={24} md={12} xl={24}>
          <CurrentPasswordItem />
        </Col>

        <Col xs={24} md={12} xl={24}>
          <NewPasswordItem />
        </Col>

        <Col xs={24} md={12} xl={24}>
          <ConfirmItemPassword />
        </Col>
      </Row>
    </BaseButtonsForm>
  );
};
