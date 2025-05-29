import { apiSlice } from "../../apiSlice";

export const userLogApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserListByFiscalYear"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getUserListByFiscalYear: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/user-report-by-program?financial_year_id=${params?.financial_year_id}&program_detail_id=${params.program_detail_id}&event_detail_id=${params.event_detail_id}`,
          }
        },
        providesTags: ["UserListByFiscalYear"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetUserListByFiscalYearQuery
} = userLogApiSlice;