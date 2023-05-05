import { useEffect, useState } from 'react';
import { useAppSelector } from './reduxHooks';
import { getAccessCode } from '@app/utils/utils';

export const usePermission = (PermissionComponent: string): number => {
  const userPermission = useAppSelector((state) => state?.user?.user?.role?.permissions);
  const [permission, setPermission] = useState(0);
  useEffect(() => {
    if (userPermission) {
      const permission = getAccessCode(userPermission, PermissionComponent);
      setPermission(permission);
    }
  }, [PermissionComponent, userPermission]);

  return permission;
};
