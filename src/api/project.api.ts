import { httpApi } from '@app/api/http.api';
import { ANY_OBJECT } from '@app/interfaces/interfaces';
import { CreateProjectRequest, ProjectState } from '@app/store/slices/projectSlice';


export interface Project {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  processes?: [ANY_OBJECT];
  tasks?: [ANY_OBJECT];
  status?: string;
}

export const createProject = async (projectPayload: CreateProjectRequest): Promise<Project> => {
  return httpApi
    .post<Project>(`projects/createProject`, projectPayload)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const getProjects = async (): Promise<ProjectState> => {
  return httpApi
    .get<ProjectState>(`projects/getProjects`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
