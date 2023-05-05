import React from 'react';
import { Modal } from '@app/components/common/Modal/Modal';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { AddRoleForm } from './AddRoleForm/AddRoleForm';
import { Col, Row } from 'antd';
import { ANY_OBJECT } from '@app/interfaces/interfaces';

export interface AddRoleDataProps {
  loading: boolean;
  onFinish: (data: ANY_OBJECT) => void;
}

interface AndRoleModalProps extends AddRoleDataProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AddRoleModal: React.FC<AndRoleModalProps> = ({ loading, isOpen, onOpenChange, onFinish }) => {
  return (
    <Modal width={900} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
      <Spinner spinning={loading}>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <AddRoleForm loading={loading} onFinish={onFinish} />
          </Col>
        </Row>
      </Spinner>
    </Modal>
  );
};
