import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Role, getRoles, updateRole, createRole, deleteRole } from '@app/api/role.api';
import { QueryRequest } from './userSlice';
import { ANY_OBJECT } from '@app/interfaces/interfaces';

export interface RoleState {
  roleList: Role | null;
}

const initialState: RoleState = {
  roleList: null,
};

export interface UpdateRoleRequest {
  role?: string;
  permissions?: ANY_OBJECT;
  routes?: [ANY_OBJECT];
  roleId: string | undefined;
}

export interface CreateRoleRequest {
  role: string;
  permissions?: ANY_OBJECT;
  routes?: [ANY_OBJECT];
}

export const getRoleList = createAsyncThunk('roles/getRoles', async (queryPayload: QueryRequest) =>
  getRoles(queryPayload),
);

export const doUpdateRole = createAsyncThunk('roles/updateRole', async (rolePayload: UpdateRoleRequest) =>
  updateRole(rolePayload),
);

export const doCreateRole = createAsyncThunk('roles/createRole', async (rolePayload: CreateRoleRequest) =>
  createRole(rolePayload),
);

export const doDeleteRole = createAsyncThunk('roles/deleteRole', async (roleId: string) => deleteRole(roleId));

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
});

export default roleSlice.reducer;
