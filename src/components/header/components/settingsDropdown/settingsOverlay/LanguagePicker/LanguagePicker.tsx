import React from 'react';
import { Radio, Space } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { RadioBtn } from '../SettingsOverlay/SettingsOverlay.styles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { capitalize } from 'utils/utils';
import { Translation } from '@app/api/translation.api';

export const LanguagePicker: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const translation = useAppSelector((state) => state.translation);

  return (
    <Radio.Group defaultValue={language} onChange={(e) => setLanguage(e.target.value)}>
      <Space direction="vertical">
        {translation?.translationList.map((item: Translation) => {
          return (
            <RadioBtn value={item.isoCode} key={item.id}>
              <Space align="center">
                {capitalize(item.name)}
                <ReactCountryFlag svg countryCode={item.flagCode} />
              </Space>
            </RadioBtn>
          );
        })}
      </Space>
    </Radio.Group>
  );
};
