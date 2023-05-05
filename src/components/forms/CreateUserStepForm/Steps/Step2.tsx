import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { DatePicker } from '@app/components/common/pickers/DatePicker';
import { Select } from '@app/components/common/selects/Select/Select';
import * as S from '../StepForm.styles';
import React from 'react';
import styled from 'styled-components';
import { Company } from '@app/interfaces/interfaces';
import { genders } from '@app/constants/genders';

const Picker = styled(DatePicker)`
  width: 100%;
`;

interface CompanyListProps {
  companyList: Company[];
}

export const Step2: React.FC<CompanyListProps> = ({ companyList }) => {
  const { t } = useTranslation();

  return (
    <S.FormContent>
      <BaseForm.Item
        name="company"
        label={t('create-user.selectCompany')}
        hasFeedback
        rules={[{ required: true, message: t('create-user.companyError') }]}
      >
        <Select placeholder={t('create-user.selectCompanyPlaceholder')} options={companyList}></Select>
      </BaseForm.Item>
      <BaseForm.Item
        name="gender"
        label={t('forms.stepFormLabels.gender')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Select placeholder={t('forms.stepFormLabels.gender')} options={genders}></Select>
      </BaseForm.Item>
      <BaseForm.Item
        name="firstname"
        label={t('common.firstName')}
        rules={[{ required: true, message: t('forms.stepFormLabels.firstNameError') }]}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="lastname"
        label={t('common.lastName')}
        rules={[{ required: true, message: t('forms.stepFormLabels.lastNameError') }]}
      >
        <Input />
      </BaseForm.Item>
      <BaseForm.Item
        name="birthdate"
        label={t('forms.stepFormLabels.birthdate')}
        rules={[{ required: true, message: t('forms.stepFormLabels.birthdayError') }]}
      >
        <Picker format="YYYY-MM-DD" />
      </BaseForm.Item>
    </S.FormContent>
  );
};
