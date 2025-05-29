import { apiSlice } from "../../apiSlice";

export const programReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["ProgramReportList", "programReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getProgramReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/program-list-report?wing_id=${params.wing_id}&financial_year_id=${params.financial_year_id}`,
          }
        },
        providesTags: ["ProgramReportList", "programReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
    useGetProgramReportQuery
} = programReportApiSlice;