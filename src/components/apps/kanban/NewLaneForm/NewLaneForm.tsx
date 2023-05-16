import React from 'react';
import { Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import * as S from './NewLaneForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import TextArea from 'antd/lib/input/TextArea';
import { doCreateStatus } from '@app/store/slices/statusSlice';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { Status } from '@app/api/status.api';
import { notificationController } from '@app/controllers/notificationController';
import { checkHTTPStatus } from '@app/utils/utils';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@app/hooks/useLoader';

interface NewLaneFormProps {
  onAdd: (values: { id: string; title: string }) => void;
  onCancel: () => void;
}

export const NewLaneForm: React.FC<NewLaneFormProps> = ({ onAdd, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loader, handleLoaderOpen, handleLoaderClose } = useLoader();
  const handleSubmit = (values: {title: string; description: string}) => {
    handleLoaderOpen();
    const data = {
      title: values.title,
      description: values.description,
      color: null
    };
    console.log("data",data);
    dispatch(doCreateStatus(data))
      .unwrap()
      .then(() => {
        handleLoaderClose();
        console.log("data");
        notificationController.success({
          message: t('status.statusSuccessMessage'),
          description: t('status.statusSuccessDescription'),
        });
      })
      .catch((err) => {
        handleLoaderClose();
        notificationController.error({ message: err.message });
        checkHTTPStatus(Number(err.code), navigate);
      });
    // onAdd({
    //   id: uuidv4(),
    //   title: values.title || t('kanban.unnamedLabel'),
    // });
  };

  return (
    <S.Form
      name="addCard"
      isFieldsChanged
      footer={<S.FooterButtons size="small" onCancel={onCancel} />}
      onFinish={handleSubmit}
      requiredMark="optional" validateTrigger="onBlur"
    >
      <Auth.FormItem
        name="title"
        label={t('kanban.title')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <Input placeholder={t('kanban.title')} bordered={false} />
      </Auth.FormItem>
      <Auth.FormItem
            name="description"
            label={t('kanban.description')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
          <TextArea placeholder={t('kanban.description')} />
        </Auth.FormItem>
    </S.Form>
  );
};
