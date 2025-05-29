import { apiSlice } from "../../apiSlice";

export const fiscalyearReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["FiscalYearReportList", "FiscalYearReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getFiscalYearReportById: builder.query<any, any>({
        query: (id : any) => ({
          url: `/auth/wing-wise-fiscalyear-report/${id}`,
        }),
        providesTags: ["FiscalYearReportList","FiscalYearReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetFiscalYearReportByIdQuery 
} = fiscalyearReportApiSlice;
