import { doRequestOTP } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { checkHTTPStatus } from '@app/utils/utils';
import { NavigateFunction } from 'react-router-dom';
import { AppDispatch } from '@app/store/store';
import { LoginTypes } from '@app/constants/enums/loginType';
import { cryptoEncrpytHandler } from './rememberMeController';

const authType = process.env.REACT_APP_OTP_BY;

interface OtpValues {
  email?: string;
  phone?: string;
  rememberMe?: boolean;
}

export const SendOtpHandler = (
  values: OtpValues,
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  t: (val: string) => void,
  setLoadingEnable: () => void,
  setLoadingDisable: () => void,
): void => {
  const payload = {
    type: authType === LoginTypes.EMAIL ? LoginTypes.EMAIL : LoginTypes.PHONE,
    email: values.email,
    phone: values.phone,
  };
  setLoadingEnable();

  dispatch(doRequestOTP(payload))
    .unwrap()
    .then((res) => {
      notificationController.info({ message: t('common.successRequestOTP') });
      if (authType === LoginTypes.EMAIL) {
        setLoadingDisable();
        navigate('/auth/security-code', { state: { email: payload.email } });
        cryptoEncrpytHandler({ email: values.email, rememberMe: values.rememberMe });
      } else {
        setLoadingDisable();
        navigate('/auth/security-code', { state: { phone: values.phone, otp: res.otp } });
        cryptoEncrpytHandler({ phone: values.phone, rememberMe: values.rememberMe });
      }
    })
    .catch((err: { message: string; code: number }) => {
      notificationController.error({ message: err.message });
      checkHTTPStatus(Number(err.code), navigate);
      setLoadingDisable();
    });
};
