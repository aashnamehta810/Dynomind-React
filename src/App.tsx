import React, { useEffect, useState, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import GlobalStyle from './styles/GlobalStyle';
import 'typeface-montserrat';
import 'typeface-lato';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useAutoNightMode } from './hooks/useAutoNightMode';
import { usePWA } from './hooks/usePWA';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';
import { contentDirection } from '@app/utils/utils';
import { getTranslationList, getTranslationWithQuery } from './store/slices/translationsSlice';
import i18next from 'i18next';
import { fetchUser } from './store/slices/userSlice';
import { usePusher } from './hooks/usePusher';
import { readToken } from './services/localStorage.service';
import { getProjectList } from './store/slices/projectSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language, setLanguage } = useLanguage();
  const [locale, setLocale] = useState();
  const theme = useAppSelector((state) => state.theme.theme);
  const translation = useAppSelector((state) => state.translation);
  const user = useAppSelector((state) => state.user.user);
  const token = readToken();
  usePWA();

  usePusher();

  useAutoNightMode();

  useThemeWatcher();

  useEffect(() => {
    if (token && (!user?.role || !user)) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    dispatch(getTranslationList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);
 
  useEffect(() => {
    if (language) {
      dispatch(getTranslationWithQuery({ isoCode: language }));
      setLanguage(language);
    }
  }, [dispatch, language, setLanguage]);

  useEffect(() => {
    (async () => {
      if (translation && translation.isoCode) {
        i18next.addResourceBundle(translation.isoCode, 'translation', translation.translations, false, false);
      }
      const data = await import(`antd/es/locale/${translation.localHelper}`);
      setLocale(data);
    })();
  }, [translation]);

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].primary} />
      <GlobalStyle />
      <HelmetProvider>
        <ConfigProvider locale={locale} direction={contentDirection(translation.isRtl)}>
          <AppRouter />
        </ConfigProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
