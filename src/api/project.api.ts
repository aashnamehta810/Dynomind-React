import { httpApi } from '@app/api/http.api';
import { CreateProjectRequest } from '@app/store/slices/projectSlice';

export interface Tasks {
  id: string;
  title: string;
  description: string;
  tags: string[];
  assignedTo: string;
  collaborators: string[];
  createdBy: string;
  status: string;
}

export interface Process {
  id: string;
  title: string;
  description: string;
  tags: string[];
  assignedTo: string;
  collaborators: string[];
  createdBy: string;
  status: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  processes?: [Process];
  tasks?: [Tasks];
  status?: string;
}

export interface ProjectQueryResponse {
  limit: number;
  page: number;
  results: [Project];
  totalPages: number;
  totalResults: number;
}

export const createProject = async (projectPayload: CreateProjectRequest): Promise<Project> => {
  return httpApi
    .post<Project>(`projects/createProject`, projectPayload)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const getProjects = async (): Promise<ProjectQueryResponse> => {
  return httpApi
    .get<ProjectQueryResponse>(`projects/getProjects`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const getProjectDetails = async (projectId: string): Promise<Project> => {
  return httpApi
    .get<Project>(`projects/${projectId}`)
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
