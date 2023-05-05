import React from 'react';
import { Space } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { capitalize } from 'utils/utils';
import { Translation } from '@app/api/translation.api';

export const LanguageItem: React.FC = () => {
  const { t } = useTranslation();
  const translation = useAppSelector((state) => state.translation);

  const languageOptions = translation?.translationList.map((lang: Translation) => (
    <Option key={lang.id} value={lang.name}>
      <Space align="center">
        <ReactCountryFlag svg countryCode={lang.flagCode} alt="country flag" />
        {capitalize(lang.name)}
      </Space>
    </Option>
  ));

  return (
    <BaseButtonsForm.Item name="language" label={t('profile.nav.personalInfo.language')}>
      <Select>{languageOptions}</Select>
    </BaseButtonsForm.Item>
  );
};
