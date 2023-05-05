import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Card } from '@app/components/common/Card/Card';
import { FirstNameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/FirstNameItem/FirstNameItem';
import { LastNameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/LastNameItem/LastNameItem';
import { SexItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/SexItem/SexItem';
import { BirthdayItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem';
import { PhoneItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/PhoneItem/PhoneItem';
import { EmailItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/EmailItem/EmailItem';
import { CountriesItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/CountriesItem/CountriesItem';
import { CitiesItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/CitiesItem/CitiesItem';
import { ZipcodeItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/ZipcodeItem/ZipcodeItem';
import { AddressItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/AddressItem/AddressItem';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { capitalize, checkHTTPStatus } from '@app/utils/utils';
import { doUpdateUserProfile } from '@app/store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { LoginTypes } from '@app/constants/enums/loginType';

const loginType = process.env.REACT_APP_LOGIN_WITH;
interface PersonalInfoFormValues {
  birthdate?: string;
  lastname: string;
  country?: string;
  website: string;
  city?: string;
  address2: string;
  address1: string;
  sex?: string;
  facebook: string;
  language?: string;
  linkedin: string;
  zipcode: string;
  firstname: string;
  twitter: string;
  phone: string;
  email: string;
}

const initialPersonalInfoValues: PersonalInfoFormValues = {
  firstname: '',
  lastname: '',
  sex: undefined,
  birthdate: undefined,
  language: undefined,
  phone: '',
  email: '',
  country: undefined,
  city: undefined,
  address1: '',
  address2: '',
  zipcode: '',
  website: '',
  twitter: '',
  linkedin: '',
  facebook: '',
};

export const PersonalInfo: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const userFormValues = useMemo(
    () =>
      user
        ? {
            firstname: capitalize(user?.firstname),
            lastname: capitalize(user?.lastname),
            email: user?.email,
            phone: user?.phone,
            phoneprefix: user?.phoneprefix,
            sex: user?.gender,
            birthdate: Dates.getDate(user?.birthdate),
            language: user?.lang,
            country: user?.country,
            city: user?.city,
            address1: user?.address1,
            address2: user?.address2,
            zipcode: user?.zipcode,
            website: user?.website,
            twitter: user?.socials?.twitter,
            linkedin: user?.socials?.linkedin,
            facebook: user?.socials?.facebook,
          }
        : initialPersonalInfoValues,
    [user],
  );

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    (values) => {
      setLoading(true);
      const payload = {
        userDetails: {
          name: values?.nickName,
          firstname: values?.firstname,
          lastname: values?.lastname,
          email: values?.email,
          gender: values?.sex,
          birthdate: values?.birthdate,
          phone: values?.phone,
          phoneprefix: values?.phoneprefix,
          address1: values?.address1,
          address2: values?.address2,
          zipcode: values?.zipcode,
          city: values?.city,
          country: values?.country,
          role: user?.role?.role,
        },
        userId: user?.id || '',
      };
      dispatch(doUpdateUserProfile(payload))
        .unwrap()
        .then(() => {
          setLoading(false);
          setFieldsChanged(false);
          notificationController.success({
            message: t('alerts.successUpdateProfile'),
          });
        })
        .catch((err) => {
          notificationController.error({ message: err.message });
          checkHTTPStatus(Number(err.code), navigate);
          setLoading(false);
        });
    },
    [user?.role?.role, user?.id, dispatch, t, navigate],
  );

  useEffect(() => {
    if (user) {
      form.setFieldsValue(userFormValues);
    }
  }, [user, form, userFormValues]);

  return (
    <Card>
      <BaseButtonsForm
        form={form}
        name="info"
        loading={isLoading}
        initialValues={userFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 10, md: 15, xl: 30 }}>
          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.title')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={12}>
            <FirstNameItem />
          </Col>

          <Col xs={24} md={12}>
            <LastNameItem />
          </Col>

          <Col xs={24} md={12}>
            <SexItem />
          </Col>

          <Col xs={24} md={12}>
            <BirthdayItem />
          </Col>

          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.contactInfo')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={12}>
            <PhoneItem verified={true} disabled={loginType === LoginTypes.EMAIL ? false : true} />
          </Col>

          <Col xs={24} md={12}>
            <EmailItem verified={true} disabled={loginType === LoginTypes.EMAIL ? true : false} />
          </Col>

          <Col span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('common.address')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </Col>

          <Col xs={24} md={12}>
            <CountriesItem />
          </Col>

          <Col xs={24} md={12}>
            <CitiesItem />
          </Col>

          <Col xs={24} md={12}>
            <AddressItem number={1} />
          </Col>

          <Col xs={24} md={12}>
            <AddressItem number={2} />
          </Col>

          <Col xs={24} md={12}>
            <ZipcodeItem />
          </Col>
        </Row>
      </BaseButtonsForm>
    </Card>
  );
};
