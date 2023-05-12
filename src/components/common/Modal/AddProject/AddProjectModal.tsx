import React from 'react';
import { Modal } from '@app/components/common/Modal/Modal';
import { AddProjectForm } from './AddProjectForm/AddProjectForm';
import { Col, Row } from 'antd';
import { Project } from '@app/api/project.api';

export interface AddProjectDataProps {
  loading: boolean;
  onFinish: (data: Project) => void;
}

interface AndProjectModalProps extends AddProjectDataProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AddProjectModal: React.FC<AndProjectModalProps> = ({ loading, isOpen, onOpenChange, onFinish }) => {
  return (
    <Modal width={900} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
      <Row gutter={[15, 15]}>
        <Col span={24}>
          <AddProjectForm loading={loading} onFinish={onFinish} />
        </Col>
      </Row>
    </Modal>
  );
};
