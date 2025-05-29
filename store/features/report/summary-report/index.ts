import { apiSlice } from "../../apiSlice";

export const summaryReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["SummaryReportList", "summaryReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getSummaryReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/summary-report?financial_year_id=${params.financial_year_id}&district_id=${params.district_id}`,
          }
        },
        providesTags: ["SummaryReportList", "summaryReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
    useGetSummaryReportQuery
} = summaryReportApiSlice;