import React from 'react';
import { useTranslation } from 'react-i18next';
import { profileNavData } from '@app/constants/profileNavData';
import { useLocation, useNavigate } from 'react-router-dom';
import * as S from './ProfileNav.styles';
import { LoginTypes } from '@app/constants/enums/loginType';

export const ProfileNav: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const navData = profileNavData.filter((item) =>
    process.env.REACT_APP_LOGIN_TYPE === LoginTypes.OTP ? item.id !== 2 : item,
  );

  return (
    <S.Wrapper>
      {navData.map((item) => (
        <S.Btn
          key={item.id}
          icon={item.icon}
          type="text"
          color={item.color}
          onClick={() => navigate(item.href)}
          isActive={`/profile/${item.href}` === location.pathname}
        >
          {t(item.name)}
        </S.Btn>
      ))}
    </S.Wrapper>
  );
};
