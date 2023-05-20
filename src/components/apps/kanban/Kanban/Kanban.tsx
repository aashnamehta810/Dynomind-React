import React, { useEffect, useCallback, useState } from 'react';
import { NewCardForm, NewCardFormProps } from '../newCardForm/NewCardForm/NewCardForm';
import { Card, CardProps } from '../Card/Card';
import { LaneHeader, LaneHeaderProps } from '../LaneHeader/LaneHeader';
import { AddCardLink } from '../AddCardLink/AddCardLink';
import { NewLaneSection } from '../NewLaneSection/NewLaneSection';
import { NewLaneForm } from '../NewLaneForm/NewLaneForm';
import { kanbanData } from '@app/constants/kanbanData';
import * as S from './Kanban.styles';
import { BORDER_RADIUS } from '@app/styles/themes/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { getProjectById } from '@app/store/slices/projectSlice';
import { Project } from '@app/api/project.api';
import { capitalize, checkHTTPStatus } from '@app/utils/utils';
import { doCreateProcess } from '@app/store/slices/processSlice';
import { notificationController } from '@app/controllers/notificationController';
import { useTranslation } from 'react-i18next';
import { Tag, Participant, CardState } from '../interfaces';
import { CreateProcessRequest } from '@app/store/slices/processSlice';

export const Kanban: React.FC = () => {
  const [projectDetails, setProjectDetails] = useState({} as Project);
  const dispatch = useAppDispatch();
  const params = useParams();
  const { projectId } = params as { projectId: string };
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const getProjectDetails = useCallback(async () => {
    const res = await dispatch(getProjectById(projectId)).unwrap();
    setProjectDetails(res);
  }, [dispatch, projectId]);

  useEffect(() => {
    getProjectDetails();
  }, [dispatch, getProjectDetails, params.projectId]);


  const handleFinish = (
    values: { title: string; description: string },
    selectedTags: Tag[],
    selectedParticipants: Participant[],
    onSuccess: () => void
  ) => {
    setIsLoading(true);
    const data: CreateProcessRequest = {
      title: values.title,
      description: values.description,
      project: projectId,
      tags: [],
      assignedTo: "64355029a1673a56c318ff72",
      collaborators: [],
      createdBy: user?.id,
      status: "644f6f893bdcb0cd8fe4c82d"
    };

    dispatch(doCreateProcess(data))
      .then(() => {
        onSuccess();
        setIsLoading(false);
        notificationController.success({
          message: t('process.processSuccessMessage'),
          description: t('process.processSuccessDescription'),
        });
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
        setIsLoading(false);
      });
  };

  return (
    <>
      <S.ProjectTitle>{capitalize(projectDetails.title)}</S.ProjectTitle>
      <S.Kanban
        components={{
          Card: (props: CardProps) => <Card {...props}/>,
          NewCardForm: (props: NewCardFormProps) => <NewCardForm {...props} isLoading={isLoading} onFinish={handleFinish}/>,
          LaneHeader: (props: LaneHeaderProps) => <LaneHeader {...props} />,
          AddCardLink,
          NewLaneSection,
          NewLaneForm,
        }}
        editable
        laneDraggable
        canAddLanes
        data={kanbanData}
        laneStyle={{ background: 'transparent', maxHeight: '100%' }}
        cardStyle={{
          borderRadius: BORDER_RADIUS,
          backgroundColor: 'var(--background-color)',
          padding: `1.25rem 1rem`,
          marginBottom: '1rem',
          minWidth: '16rem',
          maxWidth: '16rem',
        }}
      />
    </>
  );
};
