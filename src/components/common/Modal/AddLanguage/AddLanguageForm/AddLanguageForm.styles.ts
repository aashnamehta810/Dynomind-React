import { FONT_SIZE } from '@app/styles/themes/constants';
import { Typography } from 'antd';
import styled from 'styled-components';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Label = styled(Typography.Text)`
  color: var(--text-nft-light-color);
  font-size: ${FONT_SIZE.xs};
`;
