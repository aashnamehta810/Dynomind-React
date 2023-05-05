import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './AddRoleForm.styles';
import { AddRoleDataProps } from '../AddRoleModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { Button, Input } from 'antd';

export const AddRoleForm: React.FC<AddRoleDataProps> = ({ loading, onFinish }) => {
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();

  return (
    <BaseForm form={form} name="addRole" onFinish={onFinish} requiredMark="optional" validateTrigger="onBlur">
      <S.ContentWrapper>
        <S.BlockWrapper>
          <S.Label> {t('common.roles')}</S.Label>
          <Auth.FormItem
            name="role"
            label={t('tables.role')}
            hasFeedback
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input placeholder={t('tables.role')} />
          </Auth.FormItem>
        </S.BlockWrapper>

        <BaseForm.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {t('common.addRole')}
          </Button>
        </BaseForm.Item>
      </S.ContentWrapper>
    </BaseForm>
  );
};
