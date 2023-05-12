import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDialog } from '@app/hooks/useDialog';
import { AddProjectModal } from '@app/components/common/Modal/AddProject/AddProjectModal';
import { ReconciliationOutlined } from '@ant-design/icons';
import { useLoader } from '@app/hooks/useLoader';
import { lowerCase } from 'lodash';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import { checkHTTPStatus } from '@app/utils/utils';
import { useNavigate } from 'react-router-dom';
import { doCreateProject, getProjectList } from '@app/store/slices/projectSlice';
import { Project } from '@app/api/project.api';
import * as S from './ProjectMenuOption.styles';

interface ProjectContentProps {
  optionTitle: string;
}

const ProjectMenuOption: React.FC<ProjectContentProps> = ({ optionTitle }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { dialogOpen, handleDialogOpen, handleDialogClose } = useDialog();
  const { loader, handleLoaderOpen, handleLoaderClose } = useLoader();
  const { t } = useTranslation();

  const onFinish = (values: Project) => {
    handleLoaderOpen();
    const data = {
      title: lowerCase(values.title),
      description: values.description,
      createdBy: user?.id,
    };
    dispatch(doCreateProject(data))
      .unwrap()
      .then(() => {
        handleLoaderClose();
        handleDialogClose();
        dispatch(getProjectList());
        notificationController.success({
          message: t('project.projectSuccessMessage'),
          description: t('project.projectSuccessDescription'),
        });
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
        handleLoaderClose();
      });
  };

  return (
    <S.ContentWrapper>
      <AddProjectModal loading={loader} isOpen={dialogOpen} onOpenChange={handleDialogClose} onFinish={onFinish} />
      <S.Btn type={'ghost'} className="create-project" onClick={handleDialogOpen}>
        <ReconciliationOutlined /> {`${optionTitle}`}
      </S.Btn>
    </S.ContentWrapper>
  );
};

export default ProjectMenuOption;
