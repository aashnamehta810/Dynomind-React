import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Button } from '@app/components/common/buttons/Button/Button';
import { notificationController } from '@app/controllers/notificationController';
import { Dates } from '@app/constants/Dates';
import { checkHTTPStatus, mergeBy } from '@app/utils/utils';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getCompanyList } from '@app/store/slices/companySlice';
import { Company } from '@app/api/company.api';
import { useNavigate } from 'react-router-dom';
import { defaultCountryDialCode } from '@app/constants/variables';
import { Step1 } from '@app/components/forms/CreateUserStepForm/Steps/Step1';
import { Step2 } from '@app/components/forms/CreateUserStepForm/Steps/Step2';
import { Step3 } from '@app/components/forms/CreateUserStepForm/Steps/Step3';
import { Step4 } from '@app/components/forms/CreateUserStepForm/Steps/Step4';
import { Steps } from '@app/components/common/Steps/Steps.styles';
import * as S from '@app/components/forms/CreateUserStepForm/StepForm.styles';
import { AddUserDataProps } from '../AddUserModal';
import * as U from './AddUserForm.styles';

export interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

const formFileds = [
  { name: 'name', value: '' },
  { name: 'password', value: '' },
  { name: 'confirmPassword', value: '' },
  { name: 'salutation', value: 'mr' },
  { name: 'gender', value: 'Male' },
  { name: 'firstname', value: '' },
  { name: 'lastname', value: '' },
  { name: 'birthdate', value: Dates.getToday() },
  { name: 'phone', value: '' },
  { name: 'email', value: '' },
  { name: 'address1', value: '' },
  { name: 'address2', value: '' },
  { name: 'zipcode', value: '' },
  { name: 'city', value: '' },
  { name: 'country', value: '' },
  { name: 'phoneprefix', value: defaultCountryDialCode },
  { name: 'company', value: '' },
];

export const AddUserForm: React.FC<AddUserDataProps> = ({ loading, onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [fields, setFields] = useState<FieldData[]>(formFileds);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginType = process.env.REACT_APP_LOGIN_TYPE;

  useEffect(() => {
    dispatch(getCompanyList())
      .unwrap()
      .then((res) => setCompanyList(res))
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
      });
  }, [dispatch, navigate]);

  const formLabels: FormValues = {
    name: t('common.name'),
    email: t('common.email'),
    password: t('common.password'),
    confirmPassword: t('common.confirmPassword'),
    company: t('common.company'),
    salutation: t('forms.stepFormLabels.salutation'),
    gender: t('forms.stepFormLabels.gender'),
    firstname: t('common.firstName'),
    lastname: t('common.lastName'),
    birthdate: t('forms.stepFormLabels.birthdate'),
    phone: t('common.phone'),
    phoneprefix: t('common.phoneprefix'),
    address1: `${t('common.address')} 1`,
    address2: `${t('common.address')} 2`,
    zipcode: t('common.zipcode'),
    city: t('common.city'),
    country: t('common.country'),
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      value: String(item.name === 'birthdate' && item.value ? new Date(item.value).toISOString() : item.value),
    }));

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onSubmit = () => {
    onFinish(formValues);
  };

  const steps = [
    {
      title: t('common.loginDetails'),
    },
    {
      title: t('forms.stepFormLabels.info'),
    },
    {
      title: t('forms.stepFormLabels.location'),
    },
    {
      title: t('forms.stepFormLabels.confirm'),
    },
  ];

  const formFieldsUi = [
    <Step1 key="1" loginType={loginType} />,
    <Step2 key="2" companyList={companyList} />,
    <Step3 key="3" />,
    <Step4 key="4" formValues={formValues} companyList={companyList} />,
  ];

  return (
    <BaseForm
      name="stepForm"
      form={form}
      fields={fields}
      onFieldsChange={(_, allFields) => {
        const currentFields = allFields.map((item) => ({
          name: Array.isArray(item.name) ? item.name[0] : '',
          value: item.value,
        }));
        const uniqueData = mergeBy(fields, currentFields, 'name');
        setFields(uniqueData);
      }}
    >
      <U.ContentWrapper>
        <U.StepWrapper>
          <Steps className="form-steps" labelPlacement="horizontal" size="default" current={current} items={steps} />
        </U.StepWrapper>
        <div>{formFieldsUi[current]}</div>
        <S.Row className="rtl-reverse">
          {current > 0 && (
            <S.PrevButton type="default" onClick={() => prev()}>
              {t('forms.stepFormLabels.previous')}
            </S.PrevButton>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              {t('forms.stepFormLabels.next')}
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit" onClick={onSubmit} loading={loading}>
              {t('forms.stepFormLabels.done')}
            </Button>
          )}
        </S.Row>
      </U.ContentWrapper>
    </BaseForm>
  );
};
