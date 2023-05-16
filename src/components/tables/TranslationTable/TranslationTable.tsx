import React, { useState, useEffect, useCallback } from 'react';
import { Form, TablePaginationConfig, Space } from 'antd';
import { Table } from 'components/common/Table/Table';
import { BasicTableRow, Pagination } from 'api/table.api';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { EditableCell } from '../editableTable/EditableCell';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { flatMap, get, isObject, lowerCase, set } from 'lodash';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { capitalize, checkHTTPStatus, getDefaultTranslationRow, getRoutePermissionAccessCode, sortAscendingDecending } from '@app/utils/utils';
import { Translation } from '@app/api/translation.api';
import {
  TranslationState,
  doUpdateTranslation,
  getTranslationList,
  addNewLanguage,
} from '@app/store/slices/translationsSlice';
import { notificationController } from '@app/controllers/notificationController';
import { useLocation, useNavigate } from 'react-router-dom';
import * as S from './TranslationTable.styles';
import { Btn } from '@app/components/header/components/HeaderSearch/HeaderSearch.styles';
import { FilterIcon } from 'components/common/icons/FilterIcon';
import { AddLanguageModal } from '@app/components/common/Modal/AddLanguage/AddLanguageModal';
import { useDialog } from '@app/hooks/useDialog';
import { useLoader } from '@app/hooks/useLoader';
import { PermissionTypes, RoutesMapping } from '@app/constants/enums/permission';

export const TranslationTable: React.FC = () => {
  const [form] = Form.useForm();
  const translation = useAppSelector((state) => state.translation);
  const [initialPagination, setInitialPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
  });
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [filteredTableData, setFilteredTableData] = useState<{
    data: BasicTableRow[];
    pagination: Pagination;
    loading: boolean;
  }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [editingKey, setEditingKey] = useState(0);
  const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const { loader, handleLoaderOpen, handleLoaderClose } = useLoader();
  const [query, setQuery] = useState('');
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [permission, setPermission] = useState(0);
  const userPermission = useAppSelector((state) => state.user.user?.role.permissions);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setInitialPagination(pagination);
    fetch(pagination);
    cancel();
  };

  const isEditing = (record: BasicTableRow) => record.key === editingKey;

  const edit = (record: Partial<BasicTableRow> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as BasicTableRow;

      const newData = [...tableData.data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      const changes = translation?.translationList.reduce((acc: ANY_OBJECT, curr: Translation) => {
        const lang = curr.name;
        let changed = false;
        let translations: ANY_OBJECT = curr.translations ? JSON.parse(JSON.stringify(curr.translations)) : {};
        newData.forEach((field) => {
          const value = get(translations, field.key);
          const newVal = field[lang];
          if (newVal !== value) {
            translations = set(translations, field.key, newVal ? newVal : '');
            changed = true;
          }
        });
        if (changed)
          acc = acc.concat({
            ...curr,
            translations,
          });

        return acc;
      }, []);
      changes.forEach((change: Translation, index: number) => {
        dispatch(doUpdateTranslation(change))
          .unwrap()
          .then(() => {
            if (index === changes.length - 1) {
              notificationController.success({
                message: t('common.success'),
              });
              setEditingKey(0);
              dispatch(getTranslationList());
            }
          })
          .catch((err) => {
            notificationController.error({ message: err.message });
            checkHTTPStatus(Number(err.code), navigate);
          });
      });
    } catch (errInfo) {}
  };

  const columns = [
    {
      title: t('tables.key'),
      dataIndex: 'key',
      width: 'auto',
      editable: false,
      defaultSortOrder: 'descend' as const,
      sorter: (a: ANY_OBJECT, b: ANY_OBJECT) => sortAscendingDecending(a.key, b.key),
    },
    ...translation?.translationList.map((item: { name: string }) => ({
      title: capitalize(item.name),
      dataIndex: item.name,
      width: 'auto',
      editable: true,
      defaultSortOrder: 'descend' as const,
      sorter: (a: ANY_OBJECT, b: ANY_OBJECT) => {
        if (typeof a[item.name] !== 'string' && typeof b[item.name] !== 'string') return 0;
        if (typeof a[item.name] !== 'string') return -1;
        if (typeof b[item.name] !== 'string') return 1;
        return sortAscendingDecending(a[item.name], b[item.name]);
      },
    })),
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: 'auto',
      render: (text: string, record: BasicTableRow) => {
        const editable = isEditing(record);
        return (
          <Space>
            {editable ? (
              <Button type="primary" onClick={() => save(record.key)}>
                {t('common.save')}
              </Button>
            ) : (
              <Button type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                {t('common.edit')}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (userPermission) {
      const checkPermission = getRoutePermissionAccessCode(userPermission, RoutesMapping, location.pathname.split('/')[1]);  
      setPermission(checkPermission);
    }
  },[location.pathname, userPermission])

  if(permission === PermissionTypes.READ) {
    const tableActionToRemove = columns.findIndex(column => column.title === t('tables.actions'));
    if (tableActionToRemove >= 0) {
      columns.splice(tableActionToRemove,1);
    }
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: BasicTableRow) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: capitalize(col.title),
        editing: isEditing(record),
      }),
    };
  });

  const getSchema = useCallback(
    (val: ANY_OBJECT, keys = []): ANY_OBJECT =>
      isObject(val) ? flatMap(val, (v, k) => getSchema(v, [...keys, k])) : keys.join('.'),
    [],
  );

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      const translations = translation?.translationList as Translation[];
      const defaultTranslation = getDefaultTranslationRow();
      const schema = getSchema(defaultTranslation.translations as unknown as ANY_OBJECT);
      const data: ANY_OBJECT = schema.reduce(
        (acc: ANY_OBJECT, curr: string) => ({ ...acc, [curr]: { key: curr } }),
        {},
      );
      translations.map((translation) => {
        schema.map((row: string) => {
          data[row][translation.name as string] = get(translation.translations, row);
          if (!data[row][translation.name as string] && translation.name && translation.isoCode === 'en') {
            data[row][translation.name as string] = get(defaultTranslation.translations, row);
          }
        });
      });
      const res = Object.keys(data).map((row): string => data[row]);
      if (isMounted.current) {
        setTableData({
          data: res as unknown as BasicTableRow[],
          pagination: { ...pagination, total: res.length },
          loading: false,
        });
      }
    },
    [getSchema, isMounted, translation?.translationList],
  );

  const onFinish = (values: TranslationState) => {
    handleLoaderOpen();
    const data = {
      ...values,
      name: lowerCase(values.name),
      isoCode: lowerCase(values.isoCode),
    };
    dispatch(addNewLanguage(data))
      .unwrap()
      .then(() => {
        handleLoaderClose();
        handleDialogClose();
        notificationController.success({
          message: t('language.languageSuccessMessage'),
          description: t('language.languageSuccessDescription'),
        });
        dispatch(getTranslationList());
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
        handleLoaderClose();
      });
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
        pagination: { total: filtered.length },
      }));
    }
  }, [query, tableData.data]);

  return (
    <Form form={form} component={false}>
      <S.TableActionWrapper>
        <Button block type="primary" className="addLanguage" onClick={handleDialogOpen}>
          {t('common.addLanguage')}
        </Button>
        <AddLanguageModal loading={loader} isOpen={dialogOpen} onOpenChange={handleDialogClose} onFinish={onFinish} />
        <S.InputSearch
          placeholder={t('header.search')}
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
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          ...(query ? filteredTableData.pagination : tableData.pagination),
          onChange: cancel,
        }}
        onChange={handleTableChange}
        loading={query ? filteredTableData.loading : tableData.loading}
        scroll={{ x: 800 }}
      />
    </Form>
  );
};
