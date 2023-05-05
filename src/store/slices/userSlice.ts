import { Dispatch, createAction, createSlice, PrepareAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserModel } from '@app/domain/UserModel';
import type { UploadProps } from 'antd';
import {
  UsersRequest,
  createClient,
  updateClient,
  getUsersByRole,
  getUserByAuth,
  uploadFile,
  getUserList,
} from '@app/api/users.api';
import { getAWSSignedURL } from '@app/api/general.api';
import { removeSpaceAndRepalce } from '@app/utils/utils';
import { doLogout } from './authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { Entity } from '@app/constants/enums/entites';
import { GenderEnum } from '@app/constants/enums/gender';
import { Role } from '@app/api/role.api';

export interface UserState {
  user: UserModel | null;
}

export interface ClientRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: Role | string;
  company?: string;
  image?: UploadProps | string;
  firstname?: string;
  lastname?: string;
  gender?: GenderEnum | string;
  phone?: string;
  phoneprefix?: string | number;
  zipcode?: string | number;
  birthdate?: string;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
}

export interface UpdateUserRequest {
  userDetails: ClientRequest;
  userId: string;
}

export interface FileUploadRequest {
  file: UploadProps | string;
  entity: string;
  entityId: string;
}

export interface QueryRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

const initialState: UserState = { user: null };

export const setUser = createAction<PrepareAction<UserModel>>('user/setUser', (newUser) => {
  return {
    payload: newUser,
  };
});

export const getUserListByRole = createAsyncThunk('user/getUsersByRole', async (usersPayload: UsersRequest) =>
  getUsersByRole(usersPayload),
);

export const doCreateClient = createAsyncThunk('user/createClient', async (clientPayload: ClientRequest) =>
  createClient(clientPayload),
);

export const doUpdateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (clientPayload: UpdateUserRequest, { dispatch }) =>
    updateClient(clientPayload).then((res) => {
      if (res) {
        setUserDetails(res, dispatch);
      }
    }),
);

export const doUpdateUser = createAsyncThunk('user/updateUser', async (clientPayload: UpdateUserRequest) =>
  updateClient(clientPayload),
);

export const fetchUser = createAsyncThunk('auth/getUserDetails', async (unknown, { dispatch }) =>
  getUserByAuth()
    .then(async (res) => {
      setUserDetails(res, dispatch);
    })
    .catch((err) => {
      notificationController.error({ message: err.message });
      dispatch(doLogout());
    }),
);

export const doUploadProfilePicture = createAsyncThunk(
  'user/updateUserProfile',
  async (filePayload: FileUploadRequest) => uploadFile(filePayload),
);

export const fetchUserList = createAsyncThunk('user/getUserlist', async (queryPayload: QueryRequest) =>
  getUserList(queryPayload),
);

export const getImageSignedURL = async (filename: string, entity: string): Promise<string> => {
  const res = await getAWSSignedURL({ filename, entity });
  return res.toString();
};

export const setUserDetails = async (user: UserModel, dispatch: Dispatch): Promise<UserModel> => {
  const company = user?.company ? removeSpaceAndRepalce(user?.company?.name, '-') : 'common';
  const imageURL: string | null =
    company && user?.image?.name && (await getImageSignedURL(user?.image?.name, `${company}/${user?.image?.entity}`));
  if (imageURL) {
    user.image.signedURL = imageURL.toString();
  }
  dispatch(setUser(user));
  return user;
};

export const userSlice = createSlice({
  name: Entity.USER,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;
