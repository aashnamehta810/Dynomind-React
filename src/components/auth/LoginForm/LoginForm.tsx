import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doLogin } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { checkHTTPStatus } from '@app/utils/utils';
import { readRememberMeToken } from '@app/services/localStorage.service';
import { cryptoDecryptHandler, cryptoEncrpytHandler } from '@app/controllers/rememberMeController';
import LanguageDropdown from '../../common/LanguageDropdown/LanguageDropdown';

export const initValues: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false,
};
interface LoginFormData {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

interface UserDataInterFace {
  renderForm?: boolean;
  loginData: LoginFormData;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);

  const [userData, setUserData] = useState<UserDataInterFace>({
    renderForm: false,
    loginData: initValues,
  });

  useEffect(() => {
    const rememberToken = readRememberMeToken();
    if (rememberToken) {
      const loginData: LoginFormData = cryptoDecryptHandler(rememberToken) ?? initValues;
      setUserData((prevState) => ({ ...prevState, loginData, renderForm: true }));
    } else {
      setUserData((prevState) => ({ ...prevState, ...initValues, renderForm: true }));
    }
  }, []);

  const handleSubmit = (values: LoginFormData) => {
    const { email, password, rememberMe } = values;
    setLoading(true);
    const payload = {
      email: values.email,
      password: values.password,
    };
    dispatch(doLogin(payload))
      .unwrap()
      .then(() => {
        navigate('/');
        cryptoEncrpytHandler({ email, password, rememberMe });
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
        setLoading(false);
      });
  };

  if (!userData.renderForm) return <></>;

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={userData.loginData}>
        <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
        <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>
        <Auth.ActionsWrapper>
          <BaseForm.Item name="rememberMe" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
            </Auth.FormCheckbox>
          </BaseForm.Item>
          <Link to="/auth/forgot-password">
            <S.ForgotPasswordText>{t('common.forgotPass')}</S.ForgotPasswordText>
          </Link>
        </Auth.ActionsWrapper>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </BaseForm.Item>
        <Auth.FooterWrapper>
          <Auth.Text>
            {t('login.noAccount')}{' '}
            <Link to="/auth/sign-up">
              <Auth.LinkText>{t('common.here')}</Auth.LinkText>
            </Link>
          </Auth.Text>
        </Auth.FooterWrapper>
      </BaseForm>
      <LanguageDropdown />
    </Auth.FormWrapper>
  );
};
