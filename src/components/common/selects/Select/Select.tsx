import React, { ComponentProps } from 'react';
import { Select as AntSelect } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import * as S from './Select.styles';

export const { Option } = AntSelect;

export interface Options {
  id?: number | string;
  label?: number | string;
  name?: string;
  code?: number | string;
}

export interface SelectProps extends ComponentProps<typeof AntSelect>, S.SelectProps {
  className?: string;
  options?: Options[];
}

export const Select = React.forwardRef<RefSelectProps, SelectProps>(
  ({ className, width, options, children, ...props }, ref) => (
    <S.Select getPopupContainer={(triggerNode) => triggerNode} ref={ref} className={className} width={width} {...props}>
      {options &&
        options.map((option) => (
          <Option
            key={option.id ? option.id : option.code}
            value={option.id ? option.id : option.code}
            name={option.label ? option.label : option.name}
          >
            {option.label ? option.label : option.name}
          </Option>
        ))}
      {children}
    </S.Select>
  ),
);
