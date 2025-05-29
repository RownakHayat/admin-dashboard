import { apiSlice } from "../../apiSlice";

export const progressReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["SummaryReportList", "summaryReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getProgressReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/progress-report/${params?.fiscal_year_id}?wing_id=${params.wing_id}`,
          }
        },
        providesTags: ["SummaryReportList", "summaryReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
    useGetProgressReportQuery
} = progressReportApiSlice;