import { Options } from '@app/components/common/selects/Select/Select';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

export const currencies: Options[] = [
  {
    id: CurrencyTypeEnum.BTC,
    label: 'BTC',
  },
  {
    id: CurrencyTypeEnum.ETH,
    label: 'ETH',
  },
  {
    id: CurrencyTypeEnum.USD,
    label: 'USD',
  },
];
