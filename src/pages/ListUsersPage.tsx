import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { UsersTable } from '@app/components/tables/UsersTable/UsersTable';

const ListUsersPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.users')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Card id="step-form" title={t('common.users')} padding="1.25rem">
            <UsersTable />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ListUsersPage;
