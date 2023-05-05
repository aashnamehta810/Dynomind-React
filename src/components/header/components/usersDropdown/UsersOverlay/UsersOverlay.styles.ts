import styled from 'styled-components';
import { Divider, Typography } from 'antd';
import { media } from '@app/styles/themes/constants';

export const UsersOverlayMenu = styled.div`
  max-width: 15rem;
  width: 12rem;

  @media only screen and ${media.md} {
    max-width: 25rem;
  }
`;

export const Text = styled(Typography.Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  & > a {
    display: block;
  }

  &:hover {
    text-decoration: underline;
    color: var(--primary-color);
  }

  @media only screen and ${media.md} {
    font-size: 1rem;
  }
`;

export const ItemsDivider = styled(Divider).withConfig({
  shouldForwardProp: (prop) => !['eventKey', 'warnKey'].includes(prop),
})`
  margin: 0;
`;

export const DropDownContent = styled.div`
  margin: 0.5rem 0;
`;
