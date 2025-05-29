
import { apiSlice } from "../../apiSlice";

export const helpdeskActivityLogReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["HelpdeskActivityLogReport"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getHelpdeskActivityLogReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/helpdesk-activity-log-report?from_date=${params.from_date}&to_date=${params.to_date}`,
          }
        },
        providesTags: ["HelpdeskActivityLogReport"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetHelpdeskActivityLogReportQuery
} = helpdeskActivityLogReportApiSlice;