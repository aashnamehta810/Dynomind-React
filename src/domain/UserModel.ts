import { GenderEnum } from '@app/constants/enums/gender';
import { PermissionData } from '@app/interfaces/interfaces';

export interface UserModel {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  image: {
    name: string;
    entity: string;
    id: string;
    signedURL?: string;
  };
  userName: string;
  email: string;
  phone: string;
  gender: GenderEnum;
  birthdate: string;
  lang: 'en' | 'de';
  country: string;
  city: string;
  address1: string;
  address2?: string;
  zipcode: number;
  website?: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  role: {
    id: string;
    permissions: PermissionData;
    role: string;
    routes: [];
  };
  phoneprefix: string;
  company: {
    name: string;
    city: string;
    state: string;
    country: string;
    address: string;
  };
}
