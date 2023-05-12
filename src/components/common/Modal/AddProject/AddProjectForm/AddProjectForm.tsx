import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './AddProjectForm.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Button, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { AddProjectDataProps } from '../AddProjectModal';

export interface Project {
  title: string;
  description: string;
  createdBy: string;
}

export const AddProjectForm: React.FC<AddProjectDataProps> = ({ loading, onFinish }) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();

  return (
    <BaseForm form={form} name="addProject" onFinish={onFinish} requiredMark="optional" validateTrigger="onBlur">
      <S.ContentWrapper>
        <S.BlockWrapper>
          <S.Label> {t('common.project')}</S.Label>
          <Auth.FormItem
            name="title"
            label={t('project.title')}
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input placeholder={t('project.title')} />
          </Auth.FormItem>
          <Auth.FormItem
            name="description"
            label={t('project.description')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <TextArea placeholder={t('project.description')} />
          </Auth.FormItem>
        </S.BlockWrapper>
        <BaseForm.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {t('common.addProject')}
          </Button>
        </BaseForm.Item>
      </S.ContentWrapper>
    </BaseForm>
  );
};
