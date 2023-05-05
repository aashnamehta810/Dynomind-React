import React from 'react';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import CellInputNode from '../CellInputNode/CellInputNode';
import { Role } from '@app/api/role.api';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: ANY_OBJECT;
  index: number;
  children: React.ReactNode;
  required: boolean;
  roleList: Role[];
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  required,
  record,
  roleList,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <CellInputNode
          inputType={inputType}
          dataIndex={dataIndex}
          record={record}
          title={title}
          required={required}
          roleList={roleList}
        />
      ) : (
        children
      )}
    </td>
  );
};
