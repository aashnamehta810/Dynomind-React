import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import * as S from '../StepForm.styles';
import React from 'react';
import { checkOnlyNumber } from '@app/utils/utils';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { getData } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import * as C from '../../../profile/profileCard/profileFormNav/nav/PersonalInfo/CountriesItem/CountriesItem.styles';

export const Step3: React.FC = () => {
  const { t } = useTranslation();
  const countries = getData();

  const selectOptions = countries.map((country) => (
    <Option key={country.name} value={country.name}>
      <C.CountriesSpace align="center">
        <ReactCountryFlag countryCode={country.code} svg alt="country flag" />
        {country.name}
      </C.CountriesSpace>
    </Option>
  ));

  return (
    <S.FormContent>
      <BaseForm.Item
        name="address1"
        label={`${t('common.address')} 1`}
        rules={[{ required: true, message: t('forms.stepFormLabels.addressError') }]}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="address2"
        label={`${t('common.address')} 2`}
        rules={[{ required: false, message: t('forms.stepFormLabels.addressError') }]}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="zipcode"
        label={t('common.zipcode')}
        rules={[
          { required: true, message: t('forms.stepFormLabels.zipCodeError') },
          { pattern: new RegExp(checkOnlyNumber), message: t('common.shouldBeANumber') },
          { len: 6, message: t('common.zipcodeLengthError') },
        ]}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="city"
        label={t('common.city')}
        rules={[{ required: true, message: t('forms.stepFormLabels.cityError') }]}
      >
        <Input />
      </BaseForm.Item>
      <BaseButtonsForm.Item
        name="country"
        label={t('common.country')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Select showSearch filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}>
          {selectOptions}
        </Select>
      </BaseButtonsForm.Item>
    </S.FormContent>
  );
};
