import React from 'react';
import { Modal } from '@app/components/common/Modal/Modal';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { AddUserForm, FormValues } from './AddUserForm/AddUserForm';
import { Col, Row } from 'antd';

export interface AddUserDataProps {
  loading: boolean;
  onFinish: (data: FormValues[]) => void;
}

interface AndUserModalProps extends AddUserDataProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AddUserModal: React.FC<AndUserModalProps> = ({ loading, isOpen, onOpenChange, onFinish }) => {
  return (
    <Modal width={900} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
      <Spinner spinning={loading}>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <AddUserForm loading={loading} onFinish={onFinish} />
          </Col>
        </Row>
      </Spinner>
    </Modal>
  );
};
