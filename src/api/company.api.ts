import { httpApi } from '@app/api/http.api';

export interface Company {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
}

export interface CompaniesResponse {
  limit: number;
  page: number;
  results: [];
  totalPages: number;
  totalResults: number;
}

export interface CompaniesRequest {
  name?: string;
  role?: string;
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}

export const getCompanies = async (): Promise<Company[]> => {
  return httpApi
    .get<CompaniesResponse>(`companies/getcompanies`)
    .then(({ data }) => data.results)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};

export const createCompany = (companyData: Company): Promise<undefined> => {
  return httpApi
    .post<undefined>('companies/createComany', { ...companyData })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error.options);
    });
};
