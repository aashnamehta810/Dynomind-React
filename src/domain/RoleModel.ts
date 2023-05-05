import { PermissionData } from '@app/interfaces/interfaces';

export interface RoleModel {
  id: string;
  permissions: PermissionData;
  role: string;
  routes: [];
}
