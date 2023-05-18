import { createProcess } from "@app/api/process.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CreateProcessRequest {
    title: string;
    description: string;
    project: string;
    tags: string[] | null;
    assignedTo: string | null;
    collaborators: string[] | null;
    createdBy: string | undefined;
    status: string | null;
}

const initialState = {
    processList: [],
};

export const doCreateProcess = createAsyncThunk (
    'processes/createProcess',
    async (processPayload: CreateProcessRequest) => createProcess(processPayload),
);

export const processSlice = createSlice({
    name: 'process',
    initialState,
    reducers: {},
});
  
export default processSlice.reducer;