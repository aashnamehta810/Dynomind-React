import React from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { TranslationTable } from '@app/components/tables/TranslationTable/TranslationTable';

const TranslationPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.translations')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Card id="step-form" title={t('common.translations')} padding="1.25rem">
            <TranslationTable />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TranslationPage;
