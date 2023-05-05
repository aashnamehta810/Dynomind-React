import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const ImageWrapper = styled.div`
  margin-bottom: 1.875rem;
`;

export const VerifyEmailDescription = styled.div`
  margin-bottom: 1.875rem;
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};

  @media only screen and ${media.xs} {
    font-size: ${FONT_SIZE.xxs};
  }

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xs};
  }
`;

export const LinkText = styled.div`
  margin-top: 1.5rem;
  color: var(--primary-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  text-decoration: underline;
  cursor: pointer;
`;

export const OrText = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 0rem;
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};

  @media only screen and ${media.xs} {
    font-size: ${FONT_SIZE.xxs};
  }

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xs};
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const OtpText = styled.div`
  margin: 0 0 25px;
`;
