import { apiSlice } from "../../apiSlice";

export const isrStatusReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["FairSaleReportList", "FairSaleReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getIsrStatusReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/implementation-status-report?wing_id=${params.wing_id}&financial_year_id=${params.financial_year_id}&month=${params.month}`,
          }
        },
        providesTags: ["FairSaleReportList", "FairSaleReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetIsrStatusReportQuery 
} = isrStatusReportApiSlice;