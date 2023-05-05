import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { capitalize } from '@app/utils/utils';

export const expandedColumns: Array<ANY_OBJECT> = [
  {
    title: 'tables.key',
    dataIndex: 'id',
    width: 'auto',
    editable: false,
    align: 'center' as const,
    render: (_text: string, _record: ANY_OBJECT, index: number) => index + 1,
  },
  {
    title: 'tables.columns.permission',
    dataIndex: 'title',
    width: 'auto',
    inputType: 'text',
    editable: false,
    render: (text: string) => text && capitalize(text),
  },
  {
    title: 'tables.columns.readOnly',
    dataIndex: 'readOnly',
    width: 'auto',
    inputType: 'checkbox',
    align: 'center' as const,
    editable: true,
    render: (text: number) => (text ? '✅' : '❌'),
  },
  {
    title: 'tables.columns.readAndWrite',
    dataIndex: 'readAndWrite',
    width: 'auto',
    inputType: 'checkbox',
    align: 'center' as const,
    editable: true,
    render: (text: number) => (text ? '✅' : '❌'),
  },
];
