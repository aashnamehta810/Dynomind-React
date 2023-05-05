import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { StepForm } from '@app/components/forms/CreateUserStepForm/StepForm';

const CreateUserFormPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('create-user.createUserForm')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Card id="step-form" title={t('create-user.addClientDetails')} padding="1.25rem">
            <StepForm />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateUserFormPage;
