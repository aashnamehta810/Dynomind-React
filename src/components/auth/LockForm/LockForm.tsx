import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { initValues as loginInitVal } from '@app/components/auth/LoginForm/LoginForm';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import { Dates } from '@app/constants/Dates';
import { doLogin } from '@app/store/slices/authSlice';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './LockForm.styles';
import LanguageDropdown from '../../common/LanguageDropdown/LanguageDropdown';
import { UserModel } from '@app/domain/UserModel';
import avatarImg from '@app/assets/images/avatar.webp';

interface LockFormData {
  password: string;
}

const initValues = {
  password: loginInitVal.password,
};

export const LockForm: React.FC = () => {
  const navigate = useNavigate();
  const { mobileOnly } = useResponsive();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [dateState, setDateState] = useState(new Date());
  const [userDetails, setUserDetails] = useState<UserModel>();

  const user = useAppSelector((state) => state.user.user);
  const currentDateInUTC = dateState.toUTCString();
  const currentTime = Dates.format(currentDateInUTC, 'h:mm A');
  const currentDate = Dates.format(currentDateInUTC, 'dddd, MMMM D, YYYY');

  useEffect(() => {
    const interval = setInterval(() => setDateState(new Date()), 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) setUserDetails(user);
  }, [setUserDetails, user]);

  const handleSubmit = ({ password }: LockFormData) => {
    setLoading(true);
    dispatch(doLogin({ email: userDetails?.email || '', password }))
      .unwrap()
      .then(() => {
        navigate(-1);
      })
      .catch((e) => {
        notificationController.error({ message: e.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <S.ContentWrapper>
          <S.Time>{currentTime}</S.Time>
          <S.Date>{currentDate}</S.Date>
          <S.AvatarCircle>
            <Avatar
              src={userDetails?.image && userDetails?.image.signedURL ? userDetails?.image.signedURL : avatarImg}
              alt="user avatar"
              size={mobileOnly ? 59 : 77}
            />
          </S.AvatarCircle>
          <S.Name>{`${userDetails?.firstname} ${userDetails?.lastname}`}</S.Name>
        </S.ContentWrapper>
        <S.FormItem
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </S.FormItem>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
      <LanguageDropdown />
    </Auth.FormWrapper>
  );
};
