
import { apiSlice } from "../../apiSlice";

export const TokenServiceReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["TakenServiceList", "TakenServiceListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getTakenServicetReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/sme-user-profile-taken-service-report?event_detail_id=${params.event_detail_id}`,
          }
        },
        providesTags: ["TakenServiceList", "TakenServiceListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetTakenServicetReportQuery
} = TokenServiceReportApiSlice;