import styled, { css } from 'styled-components';
import { Button } from 'antd';

export const Btn = styled(Button)`
  ${(props) =>
    props.type === 'ghost' &&
    css`
      box-shadow: none;
      background-color: transparent;
      color: var(--text-secondary-color);
      border-color: none;
      border: none;

      &:hover {
        color: var(--text-sider-primary-color);
      }
    `};
`;
