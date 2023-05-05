import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@app/components/auth/LoginForm/LoginForm';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { LoginWithOTPForm } from '@app/components/auth/LoginWithOTPForm/LoginWithOTPForm';
import { LoginTypes } from '@app/constants/enums/loginType';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.login')}</PageTitle>
      {process.env.REACT_APP_LOGIN_TYPE === LoginTypes.OTP ? <LoginWithOTPForm /> : <LoginForm />}
    </>
  );
};

export default LoginPage;
