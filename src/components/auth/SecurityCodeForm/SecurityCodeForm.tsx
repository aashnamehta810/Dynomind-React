import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Image, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { VerificationCodeInput } from '@app/components/common/VerificationCodeInput/VerificationCodeInput';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doVerifySecurityCode } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import VerifyEmailImage from '@app/assets/images/verify-email.webp';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import * as S from './SecurityCodeForm.styles';
import { checkHTTPStatus } from '@app/utils/utils';
import { SendOtpHandler } from '@app/controllers/sendOtpController';
import CountDownHandler from '@app/controllers/countDownController';
import { deleteCounterToken } from '@app/services/localStorage.service';
import LanguageDropdown from '../../common/LanguageDropdown/LanguageDropdown';

interface SecurityCodeFormProps {
  onBack?: () => void;
}

export const SecurityCodeForm: React.FC<SecurityCodeFormProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { state } = useLocation();

  const navigateBack = useCallback(() => navigate(-1), [navigate]);

  const [securityCode, setSecurityCode] = useState('');
  const OTPLength = Number(process.env.REACT_APP_OTP_CODE_LENGTH);

  const [timer, setTimer] = useState(true);

  const counterToggleFunctionality = () => {
    return setTimer(false);
  };

  const values = state;
  const [loginLoader, setLoginLoader] = useState(false);
  const setLoadingEnable = () => {
    return setLoginLoader(true);
  };
  const setLoadingDisable = () => {
    return setLoginLoader(false);
  };
  const handleSubmit = () => {
    SendOtpHandler(values, dispatch, navigate, t, setLoadingEnable, setLoadingDisable);
    setTimer(true);
  };

  useEffect(() => {
    if (securityCode.length === OTPLength) {
      dispatch(doVerifySecurityCode({ otp: securityCode, email: state.email, phone: state.phone }))
        .unwrap()
        .then(() => {
          deleteCounterToken('countDown');
          navigate('/');
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          checkHTTPStatus(Number(err.code), navigate);
        });
    }
  }, [securityCode, dispatch, OTPLength, state.email, state.phone, navigate]);

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" requiredMark="optional">
        <Auth.BackWrapper onClick={onBack || navigateBack}>
          <Auth.BackIcon />
          {t('common.back')}
        </Auth.BackWrapper>
        <S.ContentWrapper>
          <S.ImageWrapper>
            <Image src={VerifyEmailImage} alt="Not found" preview={false} />
          </S.ImageWrapper>
          <Auth.FormTitle>{t('securityCodeForm.title')}</Auth.FormTitle>
          <S.VerifyEmailDescription>{t('common.verifCodeSent')}</S.VerifyEmailDescription>
          {/* temp showing otp to user when request otp via phone once we start send SMS remove this */}
          <S.OtpText>{state.otp ? `OTP: ${state.otp}` : ''}</S.OtpText>
          {loginLoader ? <Spin /> : <VerificationCodeInput autoFocus onChange={setSecurityCode} length={OTPLength} />}
          {timer ? (
            <CountDownHandler counterToggleFunctionality={counterToggleFunctionality} />
          ) : (
            <>
              <S.LinkText onClick={handleSubmit}>{t('securityCodeForm.noCode')}</S.LinkText>
              <S.OrText>{t('securityCodeForm.or')}</S.OrText>
            </>
          )}

          {state.email && <S.LinkText onClick={onBack || navigateBack}>{t('securityCodeForm.changeEmail')}</S.LinkText>}
          {state.phone && <S.LinkText onClick={onBack || navigateBack}>{t('securityCodeForm.changePhone')}</S.LinkText>}
        </S.ContentWrapper>
      </BaseForm>
      <LanguageDropdown />
    </Auth.FormWrapper>
  );
};
