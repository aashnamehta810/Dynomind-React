import { PrepareAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDefaultTranslationRow } from '@app/utils/utils';
import {
  TranslationRequest,
  getTranslation,
  getAllTranslation,
  Translation,
  updateTranslation,
  createTranslation,
} from '@app/api/translation.api';

export interface TranslationState {
  loading: boolean;
  translations: unknown;
  isoCode: string;
  isRtl: boolean;
  flagCode: string;
  localHelper: string;
  name: string;
  translationList: Translation[];
}

const initialState: TranslationState = {
  loading: false,
  translations: getDefaultTranslationRow(),
  isoCode: 'en',
  isRtl: false,
  flagCode: 'ge',
  localHelper: 'en_US',
  name: 'english',
  translationList: [],
};

export const setTranslation = createAction<PrepareAction<Translation>>(
  'translation/setTranslation',
  (newTranslation) => {
    return {
      payload: newTranslation,
    };
  },
);

export const setTranslationList = createAction<PrepareAction<[]>>(
  'translation/setTranslationList',
  (translationList) => {
    return {
      payload: translationList,
    };
  },
);

export const updateTranslationState = createAction<PrepareAction<Translation>>(
  'translation/updateTranslation',
  (translation) => {
    return {
      payload: translation,
    };
  },
);

export const getTranslationWithQuery = createAsyncThunk(
  'translation/getTranslation',
  async (translationPayload: TranslationRequest, { dispatch }) =>
    getTranslation(translationPayload).then((res) => {
      dispatch(
        setTranslation({
          translations: res?.translations,
          isoCode: res?.isoCode,
          isRtl: res?.isRtl,
          flagCode: res?.flagCode,
          localHelper: res?.localHelper,
          name: res?.name,
        }),
      );
    }),
);

export const getTranslationList = createAsyncThunk('translation/getAllTranslation', async (unknown, { dispatch }) =>
  getAllTranslation().then((res) => {
    dispatch(setTranslationList(res));
  }),
);

export const doUpdateTranslation = createAsyncThunk(
  'translation/updateTranslation',
  async (payload: Translation, { dispatch }) =>
    updateTranslation(payload).then((res) => {
      dispatch(updateTranslationState(res));
    }),
);

export const addNewLanguage = createAsyncThunk(
  'translation/createNewTranslation',
  async (payload: Translation, { dispatch }) =>
    createTranslation(payload).then((res) => {
      dispatch(updateTranslationState(res));
    }),
);

export const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setTranslation, (state, action) => {
      state.translations = action.payload.translations;
      state.isRtl = action.payload.isRtl;
      state.isoCode = action.payload.isoCode;
      state.flagCode = action.payload.flagCode;
      state.localHelper = action.payload.localHelper;
      state.name = action.payload.name;
    });
    builder.addCase(setTranslationList, (state, action) => {
      state.translationList = action.payload;
    });
  },
});

export default translationSlice.reducer;
