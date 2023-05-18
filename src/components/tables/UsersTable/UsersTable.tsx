import React, { useCallback, useEffect, useState } from 'react';
import { UserTableRow, QueryTable } from 'api/table.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { doCreateClient, doUpdateUser, fetchUserList } from '@app/store/slices/userSlice';
import { notificationController } from '@app/controllers/notificationController';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkHTTPStatus, capitalize, randomString, getRoutePermissionAccessCode } from '@app/utils/utils';
import { useTranslation } from 'react-i18next';
import { Table } from 'components/common/Table/Table';
import { Dates } from '@app/constants/Dates';
import * as S from './UsersTable.styles';
import { Button } from 'components/common/buttons/Button/Button';
import { Btn } from '@app/components/header/components/HeaderSearch/HeaderSearch.styles';
import { FilterIcon } from 'components/common/icons/FilterIcon';
import { Form, Space, TablePaginationConfig } from 'antd';
import { useDialog } from '@app/hooks/useDialog';
import { useLoader } from '@app/hooks/useLoader';
import { AddUserModal } from '@app/components/common/Modal/AddUser/AddUserModal';
import { FormValues } from '@app/components/common/Modal/AddUser/AddUserForm/AddUserForm';
import { RoleTypes } from '@app/constants/enums/roleTypes';
import { EditableCell } from '../editableTable/EditableCell';
import { getRoleList } from '@app/store/slices/roleSlice';
import { Role } from '@app/api/role.api';
import { userColumns } from './Column';
import { LoginTypes } from '@app/constants/enums/loginType';
import { PermissionTypes, RoutesMapping } from '@app/constants/enums/permission';

export const UsersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [roleList, setRoleList] = useState<Role[]>([]);
  const loginType = process.env.REACT_APP_LOGIN_TYPE;
  const location = useLocation();
  const [permission, setPermission] = useState(0);
  const userPermission = useAppSelector((state) => state.user.user?.role.permissions);

  const [initialPagination, setInitialPagination] = useState<QueryTable>({
    page: 1,
    limit: 10,
  });
  const [tableData, setTableData] = useState<{ data: UserTableRow[]; pagination: QueryTable; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [filteredTableData, setFilteredTableData] = useState<{
    data: UserTableRow[];
    pagination: QueryTable;
    loading: boolean;
  }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [editingKey, setEditingKey] = useState('');
  const [query, setQuery] = useState('');
  const [form] = Form.useForm();
  const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const { loader, handleLoaderOpen, handleLoaderClose } = useLoader();

  const isEditing = (record: UserTableRow) => record.id === editingKey;

  const edit = (record: Partial<UserTableRow>) => {
    form.setFieldsValue({
      ...record,
      birthdate: record.birthdate ? Dates.getDate(record.birthdate) : Dates.getToday(),
      role: record?.role?.role,
    });
    setEditingKey(record?.id as string);
  };

  const save = async (record: Partial<UserTableRow>) => {
    try {
      const row = (await form.validateFields()) as UserTableRow;
      const newData = [...tableData.data];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      const updateRecord = newData.find((item) => item.id === record.id);
      const payload = {
        userDetails: {
          name: updateRecord?.name,
          firstname: updateRecord?.firstname,
          lastname: updateRecord?.lastname,
          email: updateRecord?.email,
          gender: updateRecord?.gender,
          birthdate: updateRecord?.birthdate,
          phone: updateRecord?.phone,
          phoneprefix: updateRecord?.phoneprefix,
          address1: updateRecord?.address1,
          address2: updateRecord?.address2,
          zipcode: updateRecord?.zipcode,
          city: updateRecord?.city,
          country: updateRecord?.country,
          role: updateRecord?.role,
        },
        userId: record.id || '',
      };
      dispatch(doUpdateUser(payload))
        .unwrap()
        .then(() => {
          fetch(initialPagination);
          notificationController.success({
            message: t('alerts.successUpdate'),
          });
          setEditingKey('');
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          checkHTTPStatus(Number(err.code), navigate);
        });
    } catch (errInfo) {}
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPagination = {
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    };
    setInitialPagination(newPagination);
    fetch(newPagination);
  };

  const columns = [
    ...userColumns?.map((item) => {
      item.title = t(item.title);
      return item;
    }),
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: UserTableRow) => {
        const editable = isEditing(record);
        return (
          <Space>
            {editable ? (
              <Button type="primary" onClick={() => save(record)}>
                {t('common.save')}
              </Button>
            ) : (
              <Button type="ghost" disabled={editingKey !== ''} onClick={() => edit(record)}>
                {t('common.edit')}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const mergedColumns = () => {
    if (permission === PermissionTypes.READ) {
      const tableActionToRemove = columns.findIndex((column) => column.title === t('tables.actions'));
      if (tableActionToRemove >= 0) {
        columns.splice(tableActionToRemove, 1);
      }
    }

    const mergedCol = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: UserTableRow) => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: capitalize(col.title),
          editing: isEditing(record),
          roleList: roleList,
        }),
      };
    });

    return mergedCol;
  };

  const fetch = useCallback(
    (pagination: QueryTable) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      const payload = {
        page: pagination.page,
        limit: pagination.limit,
      };
      dispatch(fetchUserList(payload))
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

  const onFinish = (formValues: FormValues[]) => {
    handleLoaderOpen();
    const isLoginTypeOTP = loginType === LoginTypes.OTP;
    if (formValues.length) {
      const payload = {
        name: formValues.find((o) => o.name === 'Name')?.value || '',
        firstname: formValues.find((o) => o.name === 'First Name')?.value || '',
        lastname: formValues.find((o) => o.name === 'Last Name')?.value || '',
        email: formValues.find((o) => o.name === 'Email')?.value || '',
        password: isLoginTypeOTP ? randomString(8) : formValues.find((o) => o.name === 'Password')?.value || '',
        gender: formValues.find((o) => o.name === 'Gender')?.value || '',
        birthdate: formValues.find((o) => o.name === 'Birthdate')?.value || '',
        phoneprefix: formValues.find((o) => o.name === 'Phone prefix')?.value || '',
        phone: formValues.find((o) => o.name === 'Phone')?.value || '',
        address1: formValues.find((o) => o.name === 'Address 1')?.value || '',
        address2: formValues.find((o) => o.name === 'Address 2')?.value || '',
        zipcode: formValues.find((o) => o.name === 'Zipcode')?.value || '',
        city: formValues.find((o) => o.name === 'City')?.value || '',
        country: formValues.find((o) => o.name === 'Country')?.value || '',
        company: formValues.find((o) => o.name === 'Company')?.value || '',
        role: RoleTypes.USER,
      };

      dispatch(doCreateClient(payload))
        .unwrap()
        .then(async () => {
          notificationController.success({
            message: t('auth.signUpSuccessMessage'),
          });
          fetch(initialPagination);
          handleLoaderClose();
          handleDialogClose();
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          handleLoaderClose();
        });
    }
  };

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch, initialPagination]);

  useEffect(() => {
    if (query) {
      const data = [...tableData.data];
      const filtered = data.filter((item) => {
        return (
          Object.values(item).filter((str) => {
            return str && str.toString().toLowerCase().indexOf(query.toLowerCase()) >= 0;
          }).length > 0
        );
      });
      setFilteredTableData((tableData) => ({
        ...tableData,
        data: filtered,
        pagination: {
          ...tableData.pagination,
          total: filtered.length,
        },
        loading: false,
      }));
    }
  }, [query, tableData.data]);

  const getRoles = useCallback(async () => {
    const res = await dispatch(getRoleList({})).unwrap();
    setRoleList(res.results);
  }, [dispatch]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  useEffect(() => {
    if (userPermission) {
      const checkPermission = getRoutePermissionAccessCode(
        userPermission,
        RoutesMapping,
        location.pathname.split('/')[1],
      );
      setPermission(checkPermission);
    }
  }, [location.pathname, userPermission]);

  return (
    <Form form={form} component={false}>
      <S.TableActionWrapper>
        {permission === PermissionTypes.READWRITE &&
        <>
        <Button block type="primary" className="addUser" onClick={handleDialogOpen}>
          {t('common.addUser')}
        </Button>
        <AddUserModal loading={loader} isOpen={dialogOpen} onOpenChange={handleDialogClose} onFinish={onFinish} />
        </>
        }
        <S.InputSearch
          placeholder={t('header.search')}
          className="search-input"
          onChange={(event) => setQuery(event.target.value)}
          filter={<Btn size="small" type={'text'} aria-label="Filter" icon={<FilterIcon />} />}
          enterButton={null}
          addonAfter={null}
        />
      </S.TableActionWrapper>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={query ? filteredTableData.data : tableData.data}
        columns={mergedColumns()}
        rowClassName="editable-row"
        pagination={{
          ...(query ? filteredTableData.pagination : tableData.pagination),
          onChange: cancel,
        }}
        onChange={handleTableChange}
        loading={query ? filteredTableData.loading : tableData.loading}
        scroll={{ x: 1300 }}
      />
    </Form>
  );
};
