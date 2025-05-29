
import { apiSlice } from "../../apiSlice";

export const helpdeskBeneficiaryReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["HelpdeskActivityLogReport"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getHelpdeskBeneficiaryReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/helpdesk-beneficiary-list-report?from_date=${params.from_date}&to_date=${params.to_date}`,
          }
        },
        providesTags: ["HelpdeskActivityLogReport"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetHelpdeskBeneficiaryReportQuery
} = helpdeskBeneficiaryReportApiSlice;