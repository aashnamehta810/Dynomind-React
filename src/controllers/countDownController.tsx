import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { setCounterToken, readCounterToken, deleteCounterToken } from '@app/services/localStorage.service';

const Counter = styled.div`
  margin-top: 1rem;
  color: #fff;
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
  background: #339cfd;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 1px;
  margin: 25px 0 10px;
`;

interface CounterToggleProps {
  counterToggleFunctionality: () => void;
}

const CountDownHandler = ({ counterToggleFunctionality }: CounterToggleProps): ReactElement => {
  const _timer = readCounterToken() ?? process.env.REACT_APP_RESEND_OTP_COUNTDOWN;
  const [startTime, setStartTime] = useState<number>(Number(_timer));

  const countDown = useCallback(() => {
    const countDecrement = setInterval(() => {
      setStartTime((prev: number) => Number(prev) - 1);
    }, 1000);

    return () => {
      clearInterval(countDecrement);
    };
  }, []);

  useEffect(() => {
    countDown();
  }, [countDown]);

  useEffect(() => {
    setCounterToken(startTime.toString());
    if (startTime <= 0) {
      deleteCounterToken('countDown');
      setStartTime(0);
      counterToggleFunctionality();
    }
  }, [counterToggleFunctionality, startTime]);

  return (
    <React.Fragment>
      <Counter>{startTime}</Counter>
    </React.Fragment>
  );
};

export default CountDownHandler;
