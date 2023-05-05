import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { Step4 } from './Steps/Step4';
import { notificationController } from '@app/controllers/notificationController';
import { Dates } from '@app/constants/Dates';
import { checkHTTPStatus, mergeBy, randomString } from '@app/utils/utils';
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getCompanyList } from '@app/store/slices/companySlice';
import { Company } from '@app/api/company.api';
import { useNavigate } from 'react-router-dom';
import { doCreateClient } from '@app/store/slices/userSlice';
import { defaultCountryDialCode } from '@app/constants/variables';
import { RoleTypes } from '@app/constants/enums/roleTypes';
import { LoginTypes } from '@app/constants/enums/loginType';

interface FormValues {
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

export const StepForm: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [fields, setFields] = useState<FieldData[]>(formFileds);
  const [isLoading, setIsLoading] = useState(false);
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

  const onFinish = () => {
    const isLoginTypeOTP = loginType === LoginTypes.OTP;
    setIsLoading(true);
    const payload = {
      name: formValues.find((o) => o.name === 'Name')?.value || '',
      firstname: formValues.find((o) => o.name === 'First Name')?.value || '',
      lastname: formValues.find((o) => o.name === 'Last Name')?.value || '',
      email: formValues.find((o) => o.name === 'Email')?.value || '',
      password: isLoginTypeOTP ? randomString(8) : formValues.find((o) => o.name === 'Password')?.value || '',
      gender: formValues.find((o) => o.name === 'Gender')?.value || '',
      birthdate: formValues.find((o) => o.name === 'Birthdate')?.value || '',
      phoneprefix: formValues.find((o) => o.name === 'Phone prefix')?.value || '',
      phone: formValues.find((o) => o.name === 'Phone')?.value || '',
      address1: formValues.find((o) => o.name === 'Address 1')?.value || '',
      address2: formValues.find((o) => o.name === 'Address 2')?.value || '',
      zipcode: formValues.find((o) => o.name === 'Zipcode')?.value || '',
      city: formValues.find((o) => o.name === 'City')?.value || '',
      country: formValues.find((o) => o.name === 'Country')?.value || '',
      company: formValues.find((o) => o.name === 'Company')?.value || '',
      role: RoleTypes.USER,
    };

    dispatch(doCreateClient(payload))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        notificationController.success({
          message: t('auth.signUpSuccessMessage'),
        });
        setCurrent(0);
        setFields(formFileds);
        navigate('/');
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setIsLoading(false);
      });
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
      <Steps labelPlacement="vertical" size="small" current={current} items={steps} />

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
          <Button type="primary" onClick={onFinish} loading={isLoading}>
            {t('forms.stepFormLabels.done')}
          </Button>
        )}
      </S.Row>
    </BaseForm>
  );
};
