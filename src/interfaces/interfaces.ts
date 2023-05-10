import { NumericLiteral } from 'typescript';

export type Dimension = number | string;

export type ChartData = number[];

export type xData = number[] | string[];

export type LanguageType = string;

export type ThemeType = 'light' | 'dark';

export interface ChartSeries {
  seriesName: string;
  value: number;
  data: {
    day: number;
    value: NumericLiteral;
  };
  name: string;
}

export type ChartSeriesData = ChartSeries[];

export type Severity = 'success' | 'error' | 'info' | 'warning';

export type TwoFactorAuthOption = 'email' | 'phone';

export type ActivityStatusType = 'sold' | 'booked' | 'added';

export enum CurrencyTypeEnum {
  USD = 'USD',
  ETH = 'ETH',
  BTC = 'BTC',
}

export interface PaymentCard {
  cvc: string;
  expiry: string;
  name: string;
  number: string;
  // eslint-disable-next-line
  focused: any;
  background: string;
  isEdit: boolean;
}

export interface Company {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
}

export interface DecryptUserData {
  email?: string;
  phone?: string;
  rememberMe: boolean;
}
export interface EncryptionData {
  email?: string;
  phone?: string;
  password?: string;
  rememberMe?: boolean;
}
export interface LoginTypeProps {
  loginType?: string;
}

export interface PermissionData {
  [propKey: string]: number;
}

export interface RoutePermissionData {
  [propKey: string]: string;
}

export interface ANY_OBJECT {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
