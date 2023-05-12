import { PrepareAction , createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Project, createProject, getProjects } from '@app/api/project.api';
import { ANY_OBJECT } from '@app/interfaces/interfaces';

export interface CreateProjectRequest {
  title: string;
  description: string;
  createdBy: string | undefined;
}

export interface ProjectListResponse {
  title: string;
  description: string;
  createdBy: string;
  processes: [];
  tasks: [];
  id: string;
}

export interface ProjectState {
  projectList: ANY_OBJECT | null;
}

const initialState: ProjectState = {
  projectList: null
};

export const setProjectList = createAction<PrepareAction<[]>>(
  'projects/setProjectList',
  (projectList) => {
    return {
      payload: projectList,
    };
  },
);

export const doCreateProject = createAsyncThunk(
  'projects/createProject',
  async (projectPayload: CreateProjectRequest) => createProject(projectPayload),
);

export const getProjectList = createAsyncThunk( 'projects/getProjects', async (unknown, { dispatch }) => 
getProjects().then((res) => {
  dispatch(setProjectList(res));
}),
);

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProjectList, (state, action) => {
      state.projectList = action.payload
    });
  },
});

export default projectSlice.reducer;
