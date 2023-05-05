import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import ReactCountryFlag from 'react-country-flag';
import { getData } from 'country-list';
import * as I from '../../profile/profileCard/profileFormNav/nav/PersonalInfo/CountriesItem/CountriesItem.styles';
import * as P from '../../profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem.styles';
import { Input, InputNumber, Form } from 'antd';
import { genders } from '@app/constants/genders';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { Role } from '@app/api/role.api';
import { capitalize } from '@app/utils/utils';
import { Switch } from '@app/components/common/Switch/Switch';

interface CellInputProps extends React.HTMLAttributes<HTMLElement> {
  dataIndex: string;
  inputType: string;
  record: ANY_OBJECT;
  required: boolean;
  title: string;
  roleList: Role[];
}

const CellInputNode: React.FC<CellInputProps> = ({ inputType, dataIndex, title, required, roleList, record }) => {
  const { t } = useTranslation();
  const countries = getData();

  const selectOptions = useMemo(
    () =>
      countries.map((country) => (
        <Option key={country.name} value={country.name}>
          <I.CountriesSpace align="center">
            <ReactCountryFlag countryCode={country.code} svg alt="country flag" />
            {country.name}
          </I.CountriesSpace>
        </Option>
      )),
    [countries],
  );

  const roleOptions = useMemo(
    () =>
      roleList &&
      roleList.map((roleData: Role) => (
        <Option key={roleData.id} value={roleData.role}>
          {capitalize(roleData.role)}
        </Option>
      )),
    [roleList],
  );

  const InputNode = (inputType: string) => {
    switch (inputType) {
      case 'text':
        return <Input />;
      case 'number':
        return <InputNumber />;
      case 'genderSelect':
        return <Select placeholder={t('forms.stepFormLabels.gender')} options={genders}></Select>;
      case 'countrySelect':
        return (
          <Select
            showSearch
            filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}
          >
            {selectOptions}
          </Select>
        );
      case 'date':
        return <P.BirthdayPicker format="YYYY-MM-DD" />;
      case 'roleSelect':
        return <Select placeholder={t('forms.stepFormLabels.role')}>{roleOptions}</Select>;
      case 'checkbox':
        return <Switch defaultChecked={record[dataIndex]} />;
      default:
        return <Input />;
    }
  };

  return (
    <>
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[
          {
            required,
            message: `Please Input ${title}!`,
          },
        ]}
      >
        {InputNode(inputType)}
      </Form.Item>
    </>
  );
};

export default CellInputNode;
