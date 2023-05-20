import React, { useMemo, useState } from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { CardState, Tag, Participant } from '../../interfaces';
import { TagDropdown } from '../TagDropdown/TagDropdown';
import * as S from './NewCardForm.styles';
import { ParticipantsDropdown } from '../ParticipantsDropdown/ParticipantsDropdown';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { doCreateProcess } from '@app/store/slices/processSlice';
import { getTranslationList } from '@app/store/slices/translationsSlice';
import { notificationController } from '@app/controllers/notificationController';
import { checkHTTPStatus } from '@app/utils/utils';
import { FormInput } from '@app/constants/enums/form';
import TextArea from 'antd/lib/input/TextArea';

const formInputs = [
  {
    title: 'kanban.title',
    name: 'title',
    required: true,
    message: 'common.requiredField',
    type: FormInput.TEXT
  },
  {
    title: 'kanban.description',
    name: 'description',
    required: true,
    message: 'common.requiredField',
    type: FormInput.TEXTAREA
  },
];

export interface NewCardFormProps {
  isLoading: boolean;
  onAdd: (state: CardState) => void;
  onCancel: () => void;
  onFinish: (
    values: { title: string; description: string; },
    selectedTags: Tag[],
    selectedParticipants: Participant[],
    onSuccess: () => void
  ) => void;
}

export const NewCardForm: React.FC<NewCardFormProps> = ({onAdd, onCancel, onFinish, isLoading}) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);

  const { t } = useTranslation();

  const handleFinish = (values: { title: string; description: string }) => {
    onFinish(values, selectedTags, selectedParticipants, () => {
      setTimeout(() => {
        onAdd({ ...values, tags: selectedTags, participants: selectedParticipants });
      }, 1000);
    });
  };
  const formItems = useMemo(
    () =>
      formInputs.map((item, index) => (
        item.required ? (
          <Auth.FormItem
            key={index}
            name={item.name}
            label={t(item.title)}
            rules={[{ required: item.required, message: t(item.message) }]}
          >
            {item.type === FormInput.TEXTAREA ? (
              <TextArea placeholder={t(item.title)} />
              ) : (
              <Input placeholder={t(item.title)} bordered={false} />
              )
            }
          </Auth.FormItem>
        )
        : (
        <S.FormInput key={index} name={item.name}>
          {item.type === FormInput.TEXTAREA ? (
              <TextArea placeholder={t(item.title)} />
              ) : (
              <Input placeholder={t(item.title)} bordered={false} />
              )
            }
        </S.FormInput>
        )
      )),
    [t],
  );

  return (
    <S.CardWrapper>
      <BaseButtonsForm
        name="addCard"
        isFieldsChanged
        footer={<S.FooterButtons loading={isLoading} size="small" onCancel={onCancel} />}
        onFinish={handleFinish}
      >
        {formItems}
        <TagDropdown selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        <ParticipantsDropdown
          selectedParticipants={selectedParticipants}
          setSelectedParticipants={setSelectedParticipants}
        />
      </BaseButtonsForm>
    </S.CardWrapper>
  );
};
