import { PermissionTypes } from '@app/constants/enums/permission';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { checkHTTPStatus } from '@app/utils/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Space, TablePaginationConfig } from 'antd';
import { EditableCell } from '../../editableTable/EditableCell';
import { Table } from '@app/components/common/Table/Table';
import { Button } from 'components/common/buttons/Button/Button';
import { Popconfirm } from '@app/components/common/Popconfirm/Popconfirm';
import { notificationController } from '@app/controllers/notificationController';
import { doUpdateRole } from '@app/store/slices/roleSlice';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { QueryTable } from '@app/api/table.api';
import { useMounted } from '@app/hooks/useMounted';
import { expandedColumns } from './Column';

interface ExpandedRowProps extends React.HTMLAttributes<HTMLElement> {
  record: ANY_OBJECT;
  tableData: ANY_OBJECT;
  initialPagination: QueryTable;
  setInitialPagination: React.Dispatch<React.SetStateAction<QueryTable>>;
  fetch: (pagination: QueryTable) => void;
}

interface PermissionData {
  key: string;
  title: string;
  readOnly: boolean;
  readAndWrite: boolean;
}

const ExpandedRowRender: React.FC<ExpandedRowProps> = ({
  record,
  tableData,
  initialPagination,
  setInitialPagination,
  fetch,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editingPermissionKey, setEditingPermissionKey] = useState('');
  const { isMounted } = useMounted();
  const [permissionData, setTableData] = useState<{ data: PermissionData[]; pagination: QueryTable; loading: boolean }>(
    {
      data: [],
      pagination: initialPagination,
      loading: false,
    },
  );

  const permissionReords = useCallback(() => {
    setTableData((permissionData) => ({ ...permissionData, loading: true }));
    const pData = Object.keys(record.permissions).map((key) => {
      return {
        key: key,
        title: key,
        readOnly:
          record.permissions[key] === PermissionTypes.READ || record.permissions[key] === PermissionTypes.READWRITE,
        readAndWrite: record.permissions[key] === PermissionTypes.READWRITE,
      };
    });

    if (isMounted.current) {
      setTableData({ data: pData, pagination: initialPagination, loading: false });
    }
  }, [initialPagination, isMounted, record.permissions]);

  useEffect(() => {
    permissionReords();
  }, [permissionReords]);

  const isEditingPermission = (record: ANY_OBJECT) => record.key === editingPermissionKey;

  const editPermission = (record: ANY_OBJECT) => {
    form.setFieldsValue({
      ...record,
    });

    setEditingPermissionKey(record?.key as string);
  };

  const cancelPermission = () => {
    setEditingPermissionKey('');
  };

  const savePermission = async (updatedRecord: PermissionData) => {
    try {
      const row = (await form.validateFields()) as PermissionData;
      const newData = [...permissionData.data];
      const index = newData.findIndex((item) => updatedRecord.key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData({ ...permissionData, data: newData });
        setEditingPermissionKey('');
      } else {
        newData.push(row);
        setTableData({ ...permissionData, data: newData });
        setEditingPermissionKey('');
      }
      const updatePermissionValue = newData.filter((item) => item.key === updatedRecord.key)[0];
      const updatedRole = {
        role: record.role,
        permissions: {
          ...record.permissions,
          [updatePermissionValue.key]:
            updatePermissionValue.readOnly && updatePermissionValue.readAndWrite
              ? PermissionTypes.READWRITE
              : updatePermissionValue.readOnly
              ? PermissionTypes.READ
              : updatePermissionValue.readAndWrite
              ? PermissionTypes.READWRITE
              : PermissionTypes.NOTHING,
        },
        routes: record.routes,
        roleId: record.id,
      };
      dispatch(doUpdateRole(updatedRole))
        .unwrap()
        .then(() => {
          fetch(initialPagination);
          notificationController.success({
            message: t('alerts.successUpdate'),
          });
          setEditingPermissionKey('');
          fetch(initialPagination);
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          checkHTTPStatus(Number(err.code), navigate);
        });
    } catch (errInfo) {}
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPagination = {
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    };
    setInitialPagination(newPagination);
  };

  const columns = [
    ...expandedColumns?.map((item) => {
      item.title = t(item.title);
      return item;
    }),
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: 'auto',
      render: (_text: string, record: PermissionData) => {
        const editable = isEditingPermission(record);
        return (
          <Space>
            {editable ? (
              <>
                <Button type="primary" onClick={() => savePermission(record)}>
                  {t('common.save')}
                </Button>
                <Popconfirm title={t('tables.cancelInfo')} onConfirm={cancelPermission}>
                  <Button type="ghost">{t('common.cancel')}</Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Button type="ghost" onClick={() => editPermission(record)}>
                  {t('common.edit')}
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ANY_OBJECT) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingPermission(record),
        roleList: tableData.data,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        rowKey="id"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        columns={mergedColumns}
        rowClassName="editable-row"
        dataSource={permissionData.data}
        pagination={false}
        onChange={handleTableChange}
      />
    </Form>
  );
};

export default ExpandedRowRender;
