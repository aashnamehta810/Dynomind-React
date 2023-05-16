import { CreateStatusRequest } from "@app/store/slices/statusSlice";
import { httpApi } from "./http.api";
export interface Status {
    name: string;
    description: string;
    createdBy: string | undefined;
    color: string | null;
}

export const createStatus = async (statusPayload: CreateStatusRequest): Promise<Status> => {
    return httpApi
      .post<Status>(`status/createStatus`, statusPayload)
      .then(({ data }) => data)
      .catch((error) => {
        return Promise.reject(error.options);
      });
  };