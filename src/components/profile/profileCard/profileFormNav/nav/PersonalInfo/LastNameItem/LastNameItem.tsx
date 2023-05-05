import React from 'react';
import { Input } from '@app/components/common/inputs/Input/Input';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

export const LastNameItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item
      name="lastname"
      label={t('common.lastName')}
      rules={[{ required: true, message: t('common.requiredField') }]}
    >
      <Input />
    </BaseButtonsForm.Item>
  );
};
