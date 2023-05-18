import React, { useState, useEffect, useCallback } from 'react';
import { Form, TablePaginationConfig, Space, Popconfirm } from 'antd';
import { Table } from 'components/common/Table/Table';
import { QueryTable } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { doCreateRole, doDeleteRole, getRoleList } from '@app/store/slices/roleSlice';
import { notificationController } from '@app/controllers/notificationController';
import { capitalize, checkHTTPStatus, getRoutePermissionAccessCode } from '@app/utils/utils';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { Role } from '@app/api/role.api';
import ExpandedRowRender from './ExpandedRow/ExpandedRow';
import * as S from './RoleTable.styles';
import { Btn } from '@app/components/header/components/HeaderSearch/HeaderSearch.styles';
import { FilterIcon } from 'components/common/icons/FilterIcon';
import { AddRoleModal } from '@app/components/common/Modal/AddRole/AddRoleModal';
import { useDialog } from '@app/hooks/useDialog';
import { useLoader } from '@app/hooks/useLoader';
import { lowerCase } from 'lodash';
import { PermissionTypes, RoutesMapping } from '@app/constants/enums/permission';

export const RoleTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const { loader, handleLoaderOpen, handleLoaderClose } = useLoader();
  const [initialPagination, setInitialPagination] = useState<QueryTable>({
    page: 1,
    limit: 10,
  });
  const [tableData, setTableData] = useState<{ data: Role[]; pagination: QueryTable; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [filteredTableData, setFilteredTableData] = useState<{
    data: Role[];
    pagination: QueryTable;
    loading: boolean;
  }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [query, setQuery] = useState('');
  const [permission, setPermission] = useState(0);
  const userPermission = useAppSelector((state) => state.user.user?.role.permissions);

  const fetch = useCallback(
    (pagination: QueryTable) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      const payload = {
        page: pagination.page,
        limit: pagination.limit,
      };
      dispatch(getRoleList(payload))
        .unwrap()
        .then((res) => {
          setTableData((tableData) => ({
            ...tableData,
            data: res.results,
            pagination: {
              page: res.page,
              limit: res.limit,
              total: res.totalResults,
            },
            loading: false,
          }));
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          checkHTTPStatus(Number(err.code), navigate);
        });
    },
    [dispatch, navigate],
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPagination = {
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    };
    setInitialPagination(newPagination);
    fetch(newPagination);
  };

  const handleDeleteRow = (rowId: string) => {
    handleLoaderOpen();
    dispatch(doDeleteRole(rowId))
      .unwrap()
      .then(() => {
        handleLoaderClose();
        handleDialogClose();
        notificationController.success({
          message: t('role.roleSuccessMessage'),
          description: t('role.roleSuccessDescription'),
        });
        fetch(initialPagination);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        handleLoaderClose();
      });
  };

  const columns = [
    {
      title: t('tables.key'),
      dataIndex: 'id',
      width: 'auto',
      editable: false,
      align: 'center' as const,
      render: (text: string, record: ANY_OBJECT, index: number) => index + 1,
      sorter: (a: ANY_OBJECT, b: ANY_OBJECT) => a.id - b.id,
    },
    {
      title: t('tables.role'),
      dataIndex: 'role',
      width: 'auto',
      editable: false,
      inputType: 'roleSelect',
      align: 'center' as const,
      render: (text: string, record: ANY_OBJECT) => `${capitalize(record?.role) || '-'}`,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: 'auto',
      render: (text: string, record: Role) => {
        return (
          <Space>
            <>
              <Popconfirm title={t('tables.delete')} onConfirm={() => handleDeleteRow(record.id)}>
                <Button type="default" danger>
                  {t('tables.delete')}
                </Button>
              </Popconfirm>
            </>
          </Space>
        );
      },
    },
  ];

  const tableColumns = () => {
    if (permission === PermissionTypes.READ) {
      const tableActionToRemove = columns.findIndex((column) => column.dataIndex === 'actions');
      if (tableActionToRemove >= 0) {
        columns.splice(tableActionToRemove, 1);
      }
    }

    return columns;
  };

  const onFinish = (values: ANY_OBJECT) => {
    handleLoaderOpen();
    const data = {
      role: lowerCase(values.role),
    };
    dispatch(doCreateRole(data))
      .unwrap()
      .then(() => {
        handleLoaderClose();
        handleDialogClose();
        notificationController.success({
          message: t('role.roleSuccessMessage'),
          description: t('role.roleSuccessDescription'),
        });
        fetch(initialPagination);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
        handleLoaderClose();
      });
  };

  useEffect(() => {
    if (query) {
      const data = [...tableData.data];
      const filtered = data.filter((item) => {
        return item && item.role.toString().toLowerCase().indexOf(query.toLowerCase()) >= 0;
      });
      setFilteredTableData((tableData) => ({
        ...tableData,
        data: filtered,
        pagination: { ...tableData.pagination, total: filtered.length },
      }));
    }
  }, [query, tableData.data]);

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch, initialPagination]);

  useEffect(() => {
    if (userPermission) {
      const checkPermission = getRoutePermissionAccessCode(
        userPermission,
        RoutesMapping,
        location.pathname.split('/')[1],
      );
      setPermission(checkPermission);
    }
  }, [userPermission]);

  return (
    <Form form={form} component={false}>
      <S.TableActionWrapper>
        {permission === PermissionTypes.READWRITE &&
        <>
          <Button block type="primary" className="addRole" onClick={handleDialogOpen}>
            {t('common.addRole')}
          </Button>
          <AddRoleModal loading={loader} isOpen={dialogOpen} onOpenChange={handleDialogClose} onFinish={onFinish} />
        </>
        }
        <S.InputSearch
          placeholder={t('header.search')}
          onChange={(event) => setQuery(event.target.value)}
          filter={<Btn size="small" type={'text'} aria-label="Filter" icon={<FilterIcon />} />}
          enterButton={null}
          addonAfter={null}
        />
      </S.TableActionWrapper>
      <Table
        rowKey="id"
        bordered
        columns={tableColumns()}
        dataSource={query ? filteredTableData.data : tableData.data}
        rowClassName="editable-row"
        pagination={{
          ...(query
            ? (filteredTableData.pagination as TablePaginationConfig)
            : (tableData.pagination as TablePaginationConfig)),
        }}
        onChange={handleTableChange}
        loading={query ? filteredTableData.loading : tableData.loading}
        scroll={{ x: 800 }}
        expandable={{
          expandedRowRender: (record) => (
            <ExpandedRowRender
              record={record}
              tableData={tableData}
              initialPagination={initialPagination}
              setInitialPagination={setInitialPagination}
              fetch={fetch}
            />
          ),
        }}
      />
    </Form>
  );
};
