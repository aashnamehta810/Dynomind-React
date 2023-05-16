import React from 'react';
import { useTranslation } from 'react-i18next';
import { Kanban } from '@app/components/apps/kanban/Kanban/Kanban';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const ProjectDetailPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.project')}</PageTitle>
      <Kanban />
    </>
  );
};

export default ProjectDetailPage;
