import axios, { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';

interface Error {
  message: string[];
  statusCode: number;
}

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

httpApi.interceptors.request.use(
  (config) => {
    const token = readToken();
    if (config && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpApi.interceptors.response.use(undefined, (error: AxiosError<Error>) => {
  // to append the default error object of redux-toolkit. For more details: https://stackoverflow.com/questions/63439021/handling-errors-with-redux-toolkit
  error['name'] = error?.response?.statusText || '';
  error['code'] = error?.response?.status.toString() || '';
  error['message'] = error?.response?.data?.message
    ? error?.response?.data?.message.toString()
    : error?.response?.data.toString() || '';
  return Promise.reject(new ApiError<ApiErrorData>(error.message, error));
});

export interface ApiErrorData {
  message: string;
}
