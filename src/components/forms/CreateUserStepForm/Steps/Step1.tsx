import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { InputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import * as S from '../StepForm.styles';
import { LoginTypeProps } from '@app/interfaces/interfaces';
import { checkOnlyNumber } from '@app/utils/utils';
import { countryList } from '@app/constants/countryList';
import { Option } from '@app/components/common/selects/Select/Select';
import { LoginTypes } from '@app/constants/enums/loginType';
import { defaultCountryDialCode } from '@app/constants/variables';

export const Step1: React.FC<LoginTypeProps> = ({ loginType }) => {
  const { t } = useTranslation();
  return (
    <S.FormContent>
      <BaseForm.Item
        name="name"
        label={t('common.name')}
        rules={[{ required: true, message: t('forms.stepFormLabels.nameError') }]}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="email"
        label={t('common.email')}
        rules={[
          {
            required: true,
            message: t('forms.stepFormLabels.loginError'),
          },
          {
            type: 'email',
            message: t('common.notValidEmail'),
          },
        ]}
      >
        <Input />
      </BaseForm.Item>
      {loginType !== LoginTypes.OTP ? (
        <BaseForm.Item
          name="password"
          label={t('common.password')}
          rules={[{ required: true, message: t('forms.stepFormLabels.passwordError') }]}
        >
          <InputPassword />
        </BaseForm.Item>
      ) : (
        ''
      )}
      {loginType !== LoginTypes.OTP ? (
        <BaseForm.Item
          name="confirmPassword"
          label={t('common.confirmPassword')}
          dependencies={['password']}
          rules={[
            { required: true, message: t('common.confirmPasswordError') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('common.confirmPasswordError')));
              },
            }),
          ]}
        >
          <InputPassword />
        </BaseForm.Item>
      ) : (
        ''
      )}
      <S.PhoneItem
        name="phone"
        label={t('common.phone')}
        rules={[
          { required: true, message: t('forms.stepFormLabels.phoneError') },
          { pattern: new RegExp(checkOnlyNumber), message: t('common.shouldBeANumber') },
          { len: 10, message: t('common.phoneNumberLengthError') },
        ]}
      >
        <Input
          addonBefore={
            <BaseForm.Item name="phoneprefix" noStyle>
              <S.Select defaultValue={defaultCountryDialCode}>
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
          }
        />
      </S.PhoneItem>
    </S.FormContent>
  );
};
