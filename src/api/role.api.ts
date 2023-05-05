import { httpApi } from '@app/api/http.api';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { CreateRoleRequest, UpdateRoleRequest } from '@app/store/slices/roleSlice';
import { QueryRequest } from '@app/store/slices/userSlice';

export interface Role {
  id: string;
  role: string;
  permissions: ANY_OBJECT;
  routes: [ANY_OBJECT];
  roleId?: string;
}

export interface RolesResponse {
  limit: number;
  page: number;
  results: [];
  totalPages: number;
  totalResults: number;
}

export const getRoles = async (querPayload: QueryRequest): Promise<RolesResponse> => {
  const { page, limit } = querPayload;
  const serviceURL = page && limit ? `role?page=${page}&limit=${limit}` : `role`;
  return httpApi
    .get<RolesResponse>(`${serviceURL}`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const updateRole = async (rolePayload: UpdateRoleRequest): Promise<Role> => {
  const { roleId, role, permissions, routes } = rolePayload;
  return httpApi
    .patch<Role>(`role/${roleId}`, { role, permissions, routes })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const createRole = async (rolePayload: CreateRoleRequest): Promise<Role> => {
  const { role, permissions, routes } = rolePayload;
  return httpApi
    .post<Role>(`role/createRole`, { role, permissions, routes })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const deleteRole = async (roleId: string): Promise<Role> => {
  return httpApi
    .delete<Role>(`role/${roleId}`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
