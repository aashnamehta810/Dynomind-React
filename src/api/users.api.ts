import { httpApi } from '@app/api/http.api';
import { UserModel } from '@app/domain/UserModel';
import { PermissionData } from '@app/interfaces/interfaces';
import { ClientRequest, FileUploadRequest, QueryRequest, UpdateUserRequest } from '@app/store/slices/userSlice';

export interface User {
  id: number;
  name: string;
  email: string;
  role: {
    id: string;
    permissions: PermissionData;
    role: string;
    routes: [];
  };
  image: {
    name: string;
    entity: string;
    id: string;
    signedURL?: string;
  };
}

export interface UsersResponse {
  limit: number;
  page: number;
  results: [];
  totalPages: number;
  totalResults: number;
}

export interface UsersRequest {
  name?: string;
  role?: string;
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
  roleId?: string;
}

export interface PermissionResponse {
  id: string;
  permissions: PermissionData;
  role: string;
}

export interface UpdateUserProfileImgResponse {
  entity: string;
  entityId: string;
  id: string;
  isDeleted: boolean;
  name: string;
}

export const getUsersByRole = async (usersPayload: UsersRequest): Promise<UserModel[]> => {
  return httpApi
    .get<UsersResponse>(`users/getUserWithRole/${usersPayload.role}`)
    .then(({ data }) => data.results)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const createClient = (clientPayload: ClientRequest): Promise<undefined> => {
  return httpApi
    .post<undefined>('/users', { ...clientPayload })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const updateClient = (clientPayload: UpdateUserRequest): Promise<undefined> => {
  return httpApi
    .patch<undefined>(`/users/${clientPayload.userId}`, { ...clientPayload.userDetails })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const getUserByAuth = (): Promise<UserModel> => {
  return httpApi
    .get<UserModel>(`/users`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const uploadFile = (filePayload: FileUploadRequest): Promise<UpdateUserProfileImgResponse> => {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData.append('file', filePayload?.file as any);
  formData.append('entity', filePayload.entity as string);
  formData.append('entityId', filePayload.entityId as string);
  return httpApi
    .post<UpdateUserProfileImgResponse>(`/files/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const getUserList = (querPayload: QueryRequest): Promise<UsersResponse> => {
  const { page, limit } = querPayload;

  return httpApi
    .get<UsersResponse>(`/users/queryUsers?page=${page}&limit=${limit}`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
