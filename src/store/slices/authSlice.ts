import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  login,
  LoginRequest,
  signUp,
  SignUpRequest,
  resetPassword,
  forgotPassword,
  verifySecurityCode,
  SecurityCodePayload,
  NewPasswordData,
  setNewPassword,
  RequestOTPRequest,
  requestOTP,
} from '@app/api/auth.api';
import { setUser, setUserDetails } from '@app/store/slices/userSlice';
import { deleteToken, persistToken, readToken } from '@app/services/localStorage.service';

export interface AuthSlice {
  token: string | null;
}

const initialState: AuthSlice = {
  token: readToken(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async (loginPayload: LoginRequest, { dispatch }) => {
  const res = await login(loginPayload);
  persistToken(res?.tokens?.access?.token);
  const user = await setUserDetails(res?.user, dispatch);
  return { user, token: res?.tokens?.access?.token };
});

export const doSignUp = createAsyncThunk('auth/doSignUp', async (signUpPayload: SignUpRequest) =>
  signUp(signUpPayload),
);

export const doForgotPassword = createAsyncThunk(
  'auth/doForgotPassword',
  async (forgotPassPayload: ForgotPasswordRequest) => forgotPassword(forgotPassPayload),
);

export const doResetPassword = createAsyncThunk(
  'auth/doResetPassword',
  async (resetPassPayload: ResetPasswordRequest) => resetPassword(resetPassPayload),
);

export const doVerifySecurityCode = createAsyncThunk(
  'auth/doVerifySecurityCode',
  async (securityCodePayload: SecurityCodePayload, { dispatch }) => {
    const res = await verifySecurityCode(securityCodePayload);
    setUserDetails(res.user, dispatch);
    persistToken(res.tokens.access.token);
    return res.tokens.access.token;
  },
);

export const doSetNewPassword = createAsyncThunk('auth/doSetNewPassword', async (newPasswordData: NewPasswordData) =>
  setNewPassword(newPasswordData),
);

export const doLogout = createAsyncThunk('auth/doLogout', (payload, { dispatch }) => {
  deleteToken();
  dispatch(setUser(null));
  localStorage.clear();
});

export const doRequestOTP = createAsyncThunk('auth/requestOTP', async (requestOTPPayload: RequestOTPRequest) =>
  requestOTP(requestOTPPayload),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = '';
    });
    builder.addCase(doVerifySecurityCode.fulfilled, (state, action) => {
      state.token = action.payload;
    });
  },
});

export default authSlice.reducer;
