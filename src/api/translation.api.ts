import { httpApi } from '@app/api/http.api';

export interface Translation {
  id?: string;
  name: string;
  isRtl: boolean;
  isoCode: string;
  flagCode: string;
  localHelper: string;
  isDeleted?: boolean;
  translations?: unknown;
  translation?: unknown;
}

export interface TranslationRequest {
  isoCode?: string;
}

export const getTranslation = async (translationPayload: TranslationRequest): Promise<Translation> => {
  return httpApi
    .get<Translation>(`translation?isoCode=${translationPayload.isoCode}`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const getAllTranslation = async (): Promise<Translation[]> => {
  return httpApi
    .get<Translation[]>(`translation/all`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const updateTranslation = (payload: Translation): Promise<Translation> => {
  const data = { ...payload };
  if (data.id) delete data.id;
  return httpApi
    .patch<Translation>(`/translation/${payload.id}`, { ...data })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const createTranslation = (payload: Translation): Promise<Translation> => {
  const data = { ...payload };
  return httpApi
    .post<Translation>(`/translation/createTranslation`, { ...data })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
