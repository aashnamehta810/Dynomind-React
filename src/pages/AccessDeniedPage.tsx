import React from 'react';
import { useTranslation } from 'react-i18next';
import { Error } from '@app/components/Error/Error';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import serverError from '@app/assets/images/server-error.svg';

const AccessDeniedPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.accessDenied')}</PageTitle>
      <Error img={serverError} msg={t('common.accessDeniedMsg')} />
    </>
  );
};

export default AccessDeniedPage;
