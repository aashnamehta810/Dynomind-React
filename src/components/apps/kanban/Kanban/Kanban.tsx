import React, { useEffect, useCallback, useState } from 'react';
import { NewCardForm } from '../newCardForm/NewCardForm/NewCardForm';
import { Card } from '../Card/Card';
import { LaneHeader, LaneHeaderProps } from '../LaneHeader/LaneHeader';
import { AddCardLink } from '../AddCardLink/AddCardLink';
import { NewLaneSection } from '../NewLaneSection/NewLaneSection';
import { NewLaneForm } from '../NewLaneForm/NewLaneForm';
import { kanbanData } from '@app/constants/kanbanData';
import * as S from './Kanban.styles';
import { BORDER_RADIUS } from '@app/styles/themes/constants';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getProjectById } from '@app/store/slices/projectSlice';
import { Project } from '@app/api/project.api';
import { capitalize } from '@app/utils/utils';

export const Kanban: React.FC = () => {
  const [projectDetails, setProjectDetails] = useState({} as Project);
  const dispatch = useAppDispatch();
  const params = useParams();
  const { projectId } = params as { projectId: string };

  const getProjectDetails = useCallback(async () => {
    const res = await dispatch(getProjectById(projectId)).unwrap();
    setProjectDetails(res);
  }, [dispatch, projectId]);

  useEffect(() => {
    getProjectDetails();
  }, [dispatch, getProjectDetails, params.projectId]);

  return (
    <>
      <S.ProjectTitle>{capitalize(projectDetails.title)}</S.ProjectTitle>
      <S.Kanban
        components={{
          Card,
          NewCardForm,
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
