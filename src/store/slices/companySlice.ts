import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Company } from '@app/interfaces/interfaces';
import { createCompany, getCompanies } from '@app/api/company.api';

export interface CompanyState {
  company: Company | null;
}

const initialState: CompanyState = {
  company: null,
};

export const doCreateCompany = createAsyncThunk('companies/createCompany', async (companyPayload: Company) =>
  createCompany(companyPayload),
);

export const getCompanyList = createAsyncThunk('companies/getCompanies', async () => getCompanies());

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
});

export default companySlice.reducer;
