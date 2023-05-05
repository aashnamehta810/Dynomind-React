import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './AddLanguageForm.styles';
import { AddLanguageDataProps } from '../AddLanguageModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Button } from 'antd';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { RadioButton, RadioGroup } from '@app/components/common/Radio/Radio';
import { Select } from '@app/components/common/selects/Select/SelectCountries';
import { countryList, languageList } from '@app/constants/countryList';

export const AddLanguageForm: React.FC<AddLanguageDataProps> = ({ loading, onFinish }) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();

  return (
    <BaseForm form={form} name="addLanguage" onFinish={onFinish} requiredMark="optional" validateTrigger="onBlur">
      <S.ContentWrapper>
        <S.BlockWrapper>
          <S.Label> {t('language.languageBasicDetails')}</S.Label>
          <Auth.FormItem
            name="name"
            label={t('language.languageName')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              showSearch
              placeholder={t('language.languageName')}
              options={languageList}
              showFlag
              flag={'language'}
              filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}
            ></Select>
          </Auth.FormItem>
          <Auth.FormItem
            name="isoCode"
            label={t('language.isoCode')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              showSearch
              placeholder={t('language.isoCode')}
              options={languageList}
              showFlag={false}
              flag={'isoCode'}
              filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}
            ></Select>
          </Auth.FormItem>
          <Auth.FormItem
            name="flagCode"
            label={t('language.flagCode')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              showSearch
              placeholder={t('language.flagCode')}
              options={countryList}
              showFlag
              flag={'flagCode'}
              filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}
            ></Select>
          </Auth.FormItem>
          <Auth.FormItem
            name="localHelper"
            label={t('language.localHelper')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              showSearch
              placeholder={t('language.localHelper')}
              options={languageList}
              showFlag={false}
              flag={'localHelper'}
              filterOption={(input, option) => option?.value.toLowerCase().includes(input.toLowerCase())}
            ></Select>
          </Auth.FormItem>
          <BaseButtonsForm.Item name="isRtl" label={t('language.isRtl')}>
            <RadioGroup>
              <RadioButton value="true">True</RadioButton>
              <RadioButton value="false">False</RadioButton>
            </RadioGroup>
          </BaseButtonsForm.Item>
        </S.BlockWrapper>

        <BaseForm.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {t('common.addLanguage')}
          </Button>
        </BaseForm.Item>
      </S.ContentWrapper>
    </BaseForm>
  );
};
