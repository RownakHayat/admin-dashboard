import { apiSlice } from "../apiSlice";

export const financialYearApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["FinancialYear"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getFinancialYearList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/active-fanancial-year",
          };
        },
      }),
    }),
    overrideExisting: true,
  });

export const { useGetFinancialYearListQuery } = financialYearApiSlice;
