import { httpApi } from '@app/api/http.api';
import { CreateProcessRequest } from '@app/store/slices/processSlice';

export interface CreateProcessResponse {
    title: string;
    description: string;
    project: string;
    tags: string[] | null;
    tasks: string[] | null;
    assignedTo: string | null;
    colobarators: string[] | null;
    createdBy: string;
    status: string | null;
}

export const createProcess = async (processPayload: CreateProcessRequest): Promise<CreateProcessResponse> => {
    return httpApi
      .post(`process/createProcess`, processPayload)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.options);
    });
};
