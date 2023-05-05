import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';

export const LanguageWrapper = styled.div`
  text-align: center;
  font-size: 0.875rem;
  font-weight: 400;
  margin: 10px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;

  & :focus-visible {
    outline: none !important;
  }
  & div:focus-within {
    box-shadow: none !important;
  }
  & div > div {
    border: none !important;
    font-size: 0.875rem;
  }
  .header {
    font-weight: 600;
    font-size: 0.875rem;
    margin: 0;
    color: var(--primary-color);

    @media only screen and ${media.md} {
      font-size: 1rem;
    }
  }
`;
