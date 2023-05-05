import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@app/components/common/inputs/Input/Input';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { checkOnlyNumber } from '@app/utils/utils';

export const ZipcodeItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item
      name="zipcode"
      label={t('common.zipcode')}
      rules={[
        { required: true, message: t('common.requiredField') },
        { pattern: new RegExp(checkOnlyNumber), message: t('common.shouldBeANumber') },
        { len: 6, message: t('common.zipcodeLengthError') },
      ]}
    >
      <Input />
    </BaseButtonsForm.Item>
  );
};
