import { apiSlice } from "../../apiSlice";

export const eventWiseSelectedUserApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["EventWiseAppliedUser"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEventWiseSelectedUser: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/event-wise-selected-user-list-report?wing_id=${params.wing_id}&financial_year_id=${params.financial_year_id}&program_detail_id=${params.program_detail_id}&event_detail_id=${params.event_detail_id}`,
          };
        },
        providesTags: ["EventWiseAppliedUser"],
      }),
    }),
    overrideExisting: true,
  });

export const { useGetEventWiseSelectedUserQuery } =
  eventWiseSelectedUserApiSlice;
