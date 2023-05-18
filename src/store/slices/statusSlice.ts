import { createStatus, Status } from "@app/api/status.api";
import { Entity } from "@app/constants/enums/entites";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CreateStatusRequest {
    title: string;
    description: string;
    color: string | null;
}

export interface StatusState {
    status: Status | null;
  }
  
  const initialState: StatusState = {
    status: null,
  };


export const doCreateStatus = createAsyncThunk(
'status/createStatus',
async (statusPayload: CreateStatusRequest) => createStatus(statusPayload),
);

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {},
});

export default statusSlice.reducer;