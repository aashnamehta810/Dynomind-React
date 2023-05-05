import React from 'react';
import * as S from './LanguageDropdown.styles';
import { useLanguage } from '@app/hooks/useLanguage';
import { useAppSelector } from '@app/hooks/reduxHooks';
import ReactCountryFlag from 'react-country-flag';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { LanguageType } from '@app/interfaces/interfaces';
import { Translation } from '@app/api/translation.api';
import { isArray } from 'lodash';

const LanguageDropdown: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { translationList } = useAppSelector((state) => state.translation);

  const handleChange = (value: unknown) => {
    setLanguage(value as LanguageType);
  };

  return (
    <S.LanguageWrapper>
      <Select defaultValue={language} onChange={handleChange}>
        {translationList &&
          isArray(translationList) &&
          translationList.length > 0 &&
          translationList.map((option: Translation) => (
            <Option key={option.name} value={option.isoCode}>
              {option.name} <ReactCountryFlag svg countryCode={option.flagCode} />
            </Option>
          ))}
      </Select>
    </S.LanguageWrapper>
  );
};

export default LanguageDropdown;
