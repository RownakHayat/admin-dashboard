import { apiSlice } from "../../apiSlice";

export const userLogApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserLogReport"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getUserLogReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/user-log-report?user_id=${params.user_id}&from_date=${params.from_date}&to_date=${params.to_date}`,
          }
        },
        providesTags: ["UserLogReport"],
      }),

      getSMEUserList: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-sme-user-list",
        }),
        providesTags: ["UserLogReport"],
      }),


    }),
    overrideExisting: true,
  });

export const {
  useGetSMEUserListQuery,
    useGetUserLogReportQuery
} = userLogApiSlice;