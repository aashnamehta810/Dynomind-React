import React from 'react';
import { Modal } from '@app/components/common/Modal/Modal';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { TranslationState } from '@app/store/slices/translationsSlice';
import { AddLanguageForm } from './AddLanguageForm/AddLanguageForm';

export interface AddLanguageDataProps {
  loading: boolean;
  onFinish: (data: TranslationState) => void;
}

interface AndLanguageModalProps extends AddLanguageDataProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AddLanguageModal: React.FC<AndLanguageModalProps> = ({ loading, isOpen, onOpenChange, onFinish }) => {
  return (
    <Modal width={500} open={isOpen} onCancel={onOpenChange} footer={null} destroyOnClose>
      <Spinner spinning={loading}>
        <AddLanguageForm loading={loading} onFinish={onFinish} />
      </Spinner>
    </Modal>
  );
};
