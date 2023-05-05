import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from '../../../../../../forms/CreateUserStepForm/StepForm.styles';
import { checkOnlyNumber } from '@app/utils/utils';
import { Input } from '@app/components/common/inputs/Input/Input';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { countryList } from '@app/constants/countryList';
import { Option } from '@app/components/common/selects/Select/Select';
import { defaultCountryDialCode } from '@app/constants/variables';

interface PhoneItemsProps {
  required?: boolean;
  onClick?: () => void;
  verified?: boolean;
  disabled: boolean;
}

export const PhoneItem: React.FC<PhoneItemsProps> = ({ disabled, verified }) => {
  const { t } = useTranslation();

  const prefixSelector = (
    <BaseForm.Item name="phoneprefix" noStyle>
      <S.Select defaultValue={defaultCountryDialCode} disabled={disabled}>
        {countryList &&
          countryList.map((item, index) => {
            return (
              <Option key={`${item.name}-${index}`} value={item.dial_code}>
                {item.dial_code}
              </Option>
            );
          })}
      </S.Select>
    </BaseForm.Item>
  );

  return (
    <S.PhoneItem
      name="phone"
      $isSuccess={verified}
      $successText={t('profile.nav.personalInfo.verified')}
      label={t('common.phone')}
      rules={[
        { required: true, message: t('forms.stepFormLabels.phoneError') },
        { pattern: new RegExp(checkOnlyNumber), message: t('common.shouldBeANumber') },
        { len: 10, message: t('common.phoneNumberLengthError') },
      ]}
    >
      <Input addonBefore={prefixSelector} disabled={disabled} />
    </S.PhoneItem>
  );
};
