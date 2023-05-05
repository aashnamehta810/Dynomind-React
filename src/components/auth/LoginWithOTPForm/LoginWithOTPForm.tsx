import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import * as S from './LoginWithOTPForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { checkOnlyNumber } from '@app/utils/utils';
import { SendOtpHandler } from '@app/controllers/sendOtpController';
import { cryptoDecryptHandler } from '@app/controllers/rememberMeController';
import { readRememberMeToken } from '@app/services/localStorage.service';
import { LoginTypes } from '@app/constants/enums/loginType';
import LanguageDropdown from '../../common/LanguageDropdown/LanguageDropdown';

export const initValues: LoginWithOTPFormData = {
  phone: '',
  email: '',
  rememberMe: false,
};
interface LoginWithOTPFormData {
  phone?: string;
  email?: string;
  rememberMe?: boolean;
}

interface UserDataInterFace {
  renderForm?: boolean;
  loginData: LoginWithOTPFormData;
}

export const LoginWithOTPForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [loginLoader, setLoginLoader] = useState(false);

  const setLoadingEnable = () => {
    return setLoginLoader(true);
  };

  const setLoadingDisable = () => {
    return setLoginLoader(false);
  };

  const [userData, setUserData] = useState<UserDataInterFace>({
    renderForm: false,
    loginData: initValues,
  });

  useEffect(() => {
    const rememberToken = readRememberMeToken();
    if (rememberToken) {
      const loginData: LoginWithOTPFormData = cryptoDecryptHandler(rememberToken) ?? initValues;
      setUserData((prevState) => ({ ...prevState, loginData, renderForm: true }));
    } else {
      setUserData((prevState) => ({ ...prevState, ...initValues, renderForm: true }));
    }
  }, []);

  const handleSubmit = (values: LoginWithOTPFormData) => {
    SendOtpHandler(values, dispatch, navigate, t, setLoadingEnable, setLoadingDisable);
  };

  if (!userData.renderForm) return <></>;

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={userData.loginData}>
        <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
        {process.env.REACT_APP_LOGIN_WITH === LoginTypes.EMAIL ? (
          <S.LoginDescription>{t('login.loginWitOTPViaEmailInfo')}</S.LoginDescription>
        ) : (
          <S.LoginDescription>{t('login.loginWitOTPViaPhoneInfo')}</S.LoginDescription>
        )}
        {process.env.REACT_APP_LOGIN_WITH === LoginTypes.EMAIL ? (
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
        ) : (
          <Auth.FormItem
            name="phone"
            label={t('common.phone')}
            rules={[
              { required: true, message: t('common.requiredField') },
              { pattern: new RegExp(checkOnlyNumber), message: t('common.shouldBeANumber') },
              { len: 10, message: t('common.phoneNumberLengthError') },
            ]}
          >
            <Auth.FormInput placeholder={t('common.phone')} />
          </Auth.FormItem>
        )}
        <Auth.ActionsWrapper>
          <BaseForm.Item name="rememberMe" valuePropName="checked" noStyle>
            <Auth.FormCheckbox>
              <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
            </Auth.FormCheckbox>
          </BaseForm.Item>
        </Auth.ActionsWrapper>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={loginLoader}>
            {t('common.requestOTP')}
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
