import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import companyReducer from '@app/store/slices/companySlice';
import translationReducer from '@app/store/slices/translationsSlice';
import roleReducer from '@app/store/slices/roleSlice';

export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  company: companyReducer,
  translation: translationReducer,
  role: roleReducer,
};
