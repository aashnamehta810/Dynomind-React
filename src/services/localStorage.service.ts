import { Cookies } from 'react-cookie';
const cookies = new Cookies();

export const persistToken = (token: string): void => {
  cookies.set('accessToken', token, { path: '/' });
};

export const readToken = (): string => {
  return cookies.get('accessToken');
};

export const deleteToken = (): void => cookies.remove('accessToken');

export const setRememberMeToken = (user: string): void => {
  localStorage.setItem('rememberMe', user);
};

export const readRememberMeToken = (): string | null => {
  return localStorage.getItem('rememberMe') || null;
};

export const deleteRememberMeToken = (rememberMeKey: string): void => {
  localStorage.removeItem(rememberMeKey);
};

export const setCounterToken = (val: string): void => {
  localStorage.setItem('countDown', val);
};

export const readCounterToken = (): string | null => {
  return localStorage.getItem('countDown') || null;
};

export const deleteCounterToken = (countDownKey: string): void => {
  localStorage.removeItem(countDownKey);
};
