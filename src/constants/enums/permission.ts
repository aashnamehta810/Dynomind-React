export const PermissionTypes = {
  NOTHING: 0,
  READ: 1,
  READWRITE: 2,
};

export const PermissionComponents = {
  NOTIFICATION: 'notifications',
  USER: 'users',
  SETTING: 'settings',
  TRANSLATION: 'translations',
  CREATEUSER: 'creatusers',
};

export const RoutesMapping = {
  creatusers: 'create-user',
  users: 'list-users',
  translations: 'translations',
  notifications: 'notifications',
  settings: 'security-settings',
  projects: 'projects',
  roles: 'roles',
  createproject: 'project-create',
};
