import React from 'react';
import * as S from './References.styles';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>
        Made by{' '}
        <a href="" target="_blank" rel="noreferrer">
          Dynomind{' '}
        </a>
        in 2022 &copy;
      </S.Text>
      <S.Icons>
        <a href="" target="_blank" rel="noreferrer">
          <GithubOutlined />
        </a>
        <a href="" target="_blank" rel="noreferrer">
          <TwitterOutlined />
        </a>
        <a href="" target="_blank" rel="noreferrer">
          <FacebookOutlined />
        </a>
        <a href="" target="_blank" rel="noreferrer">
          <LinkedinOutlined />
        </a>
      </S.Icons>
    </S.ReferencesWrapper>
  );
};
