import { httpApi } from '@app/api/http.api';
import { UserModel } from '@app/domain/UserModel';

export interface AuthData {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string | undefined;
  company: string | undefined;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  token: string;
}
export interface SecurityCodePayload {
  otp: string;
  email?: string;
  phone?: number;
}

export interface NewPasswordData {
  newPassword: string;
}

export interface LoginRequest {
  email: string | undefined;
  password: string | undefined;
}

export interface LoginResponse {
  tokens: {
    access: {
      expires: Date;
      token: string;
    };
  };
  user: UserModel;
}

export interface RequestOTPRequest {
  email?: string;
  phone?: string;
  type: string;
}

export interface RequestOTPResponse {
  otp?: number;
}

export const login = (loginPayload: LoginRequest): Promise<LoginResponse> =>
  httpApi
    .post<LoginResponse>('auth/login', { ...loginPayload })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });

export const signUp = (signUpData: SignUpRequest): Promise<undefined> =>
  httpApi.post<undefined>('auth/register', { ...signUpData }).then(({ data }) => data);

export const resetPassword = (resetPasswordPayload: ResetPasswordRequest): Promise<undefined> =>
  httpApi
    .post<undefined>(`auth/reset-password?token=${resetPasswordPayload.token}`, {
      password: resetPasswordPayload.password,
    })
    .then(({ data }) => data);

export const forgotPassword = (forgotPasswordPayload: ForgotPasswordRequest): Promise<undefined> =>
  httpApi
    .post<undefined>('auth/forgot-password', { ...forgotPasswordPayload })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });

export const verifySecurityCode = (securityCodePayload: SecurityCodePayload): Promise<LoginResponse> =>
  httpApi
    .post<LoginResponse>('auth/verify-otp', { ...securityCodePayload })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });

export const setNewPassword = (newPasswordData: NewPasswordData): Promise<undefined> =>
  httpApi.post<undefined>('setNewPassword', { ...newPasswordData }).then(({ data }) => data);

export const requestOTP = (requestOTPPayload: RequestOTPRequest): Promise<RequestOTPResponse> =>
  httpApi
    .post<RequestOTPResponse>('auth/request-otp', { ...requestOTPPayload })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
