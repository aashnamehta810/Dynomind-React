import React, { ComponentProps } from 'react';
import { Select as AntSelect } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import * as S from './Select.styles';
import ReactCountryFlag from 'react-country-flag';
import * as C from '../../../profile/profileCard/profileFormNav/nav/PersonalInfo/CountriesItem/CountriesItem.styles';

export const { Option } = AntSelect;

export interface Options {
  id?: number | string;
  label?: number | string;
  name?: string;
  code?: string;
  language_code?: string;
  antd_helper_file?: string;
}

export interface SelectProps extends ComponentProps<typeof AntSelect>, S.SelectProps {
  className?: string;
  options?: Options[];
  showFlag?: boolean;
  flag?: string;
}

export const Select = React.forwardRef<RefSelectProps, SelectProps>(
  ({ className, width, options, children, showFlag, flag, ...props }, ref) => {
    const addValue = (flag: string | undefined, option: Options) => {
      switch (flag) {
        case 'language':
          return option.name;
        case 'isoCode':
          return option.language_code;
        case 'flagCode':
          return option.code;
        case 'localHelper':
          return option.antd_helper_file;
        default:
          return option.name;
      }
    };

    const labels = (flag: string | undefined, option: Options) => {
      switch (flag) {
        case 'language':
          return option.name;
        case 'isoCode':
          return `${option.name} - ${option.language_code}`;
        case 'flagCode':
          return option.code;
        case 'localHelper':
          return `${option.name} - ${option.antd_helper_file}`;
        default:
          return option.name;
      }
    };

    return (
      <S.Select
        getPopupContainer={(triggerNode) => triggerNode}
        ref={ref}
        className={className}
        width={width}
        {...props}
      >
        {options &&
          options.map((option) => (
            <Option key={option.name} value={addValue(flag, option)}>
              <C.CountriesSpace align="center">
                {showFlag && option.code && <ReactCountryFlag countryCode={option.code} svg alt="country flag" />}
                {labels(flag, option)}
              </C.CountriesSpace>
            </Option>
          ))}
        {children}
      </S.Select>
    );
  },
);
