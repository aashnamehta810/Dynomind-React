import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import * as S from './BirthdayItem.styles';

export const BirthdayItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item
      name="birthdate"
      label={t('profile.nav.personalInfo.birthdate')}
      rules={[{ required: true, message: t('common.requiredField') }]}
    >
      <S.BirthdayPicker format="L" />
    </BaseButtonsForm.Item>
  );
};
