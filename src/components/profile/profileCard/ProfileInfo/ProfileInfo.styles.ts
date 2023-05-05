import styled from 'styled-components';
import { Typography } from 'antd';
import { media } from '@app/styles/themes/constants';

export const Wrapper = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

export const ImgWrapper = styled.div`
  width: 6.9375rem;
  margin: 0 auto 1.25rem auto;
  display: flex;
  justify-content: center;
  border-radius: 50%;
  position: relative;

  background: conic-gradient(
    from -35.18deg at 50% 50%,
    #006ccf -154.36deg,
    #ff5252 24.13deg,
    #ffb155 118.76deg,
    #006ccf 205.64deg,
    #ff5252 384.13deg
  );

  @media only screen and ${media.xl} {
    width: 11.125rem;
    margin: 0 auto 2rem auto;
  }

  & > span {
    margin: 5px;
    width: calc(100% - 10px);
    height: calc(100% - 10px);

    @media only screen and ${media.xl} {
      margin: 7px;
    }
  }
  & .editIcon {
    position: absolute;
    right: 9px;
    bottom: 9px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  & .editIcon > div > span > div > img {
    margin-bottom: 0px;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  & div {
    margin: 0 5px;
  }
  & div > img {
    margin: 0;
    cursor: pointer;
  }
`;
export const Title = styled(Typography.Text)`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media only screen and ${media.xl} {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export const Subtitle = styled(Typography.Text)`
  margin-bottom: 2rem;

  @media only screen and ${media.xl} {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
`;

export const Text = styled(Typography.Text)`
  font-size: 0.75rem;
  text-align: left;

  color: var(--text-main-color);

  @media only screen and ${media.md} {
    text-align: center;
  }

  @media only screen and ${media.xl} {
    font-size: 0.875rem;
    text-align: left;
  }
`;
