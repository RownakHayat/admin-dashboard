import { apiSlice } from "../../apiSlice";

export const fairSaleReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["FairSaleReportList", "FairSaleReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getFairSaleReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/fair-sale-report?event_detail_id=${params.event_detail_id}`,
          }
        },
        providesTags: ["FairSaleReportList", "FairSaleReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetFairSaleReportQuery 
} = fairSaleReportApiSlice;