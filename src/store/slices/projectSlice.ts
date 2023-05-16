import { PrepareAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Process, Project, Tasks, createProject, getProjectDetails, getProjects } from '@app/api/project.api';

export interface CreateProjectRequest {
  title: string;
  description: string;
  createdBy: string | undefined;
}

export interface ProjectListResponse {
  title: string;
  description: string;
  createdBy: string;
  processes: Process[];
  tasks: Tasks[];
  id: string;
}

export interface ProjectState {
  projectList: Project[] | null;
}

const initialState = {
  projectList: [],
};

export const setProjectList = createAction<PrepareAction<[]>>('projects/setProjectList', (projectList) => {
  return {
    payload: projectList,
  };
});

export const doCreateProject = createAsyncThunk(
  'projects/createProject',
  async (projectPayload: CreateProjectRequest) => createProject(projectPayload),
);

export const getProjectList = createAsyncThunk('projects/getProjects', async (unknown, { dispatch }) =>
  getProjects().then((res) => {
    dispatch(setProjectList(res.results));
  }),
);

export const getProjectById = createAsyncThunk('projects/getProjectById', async (projectId: string) =>
  getProjectDetails(projectId),
);

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProjectList, (state, action) => {
      state.projectList = action.payload;
    });
  },
});

export default projectSlice.reducer;
