import { httpApi } from '@app/api/http.api';

export interface FileSignedURLRequest {
  filename: string;
  entity: string;
}

export interface SignedURl {
  imageURL: string;
}

export const getAWSSignedURL = async (filePayload: FileSignedURLRequest): Promise<SignedURl> => {
  return httpApi
    .post<SignedURl>(`files/getSignedURL`, { ...filePayload })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
