import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { RoleTable } from '@app/components/tables/RoleTable/RoleTable';

const RolesPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.roles')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Card id="step-form" title={t('common.roles')} padding="1.25rem">
            <RoleTable />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RolesPage;
