import { Options } from '@app/components/common/selects/Select/Select';
import { Gender } from './enums/gender';

export const genders: Options[] = [
  {
    id: Gender.MALE,
    label: 'Male',
  },
  {
    id: Gender.FEMALE,
    label: 'Female',
  },
];
