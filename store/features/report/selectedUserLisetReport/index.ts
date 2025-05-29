import { apiSlice } from "../../apiSlice";

export const selectedUserLisetReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["SelectedUserListList", "SelectedUserListListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getSelectedUserListReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/event-wise-selected-user-list-report?event_detail_id=${params.event_detail_id}`,
          }
        },
        providesTags: ["SelectedUserListList", "SelectedUserListListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetSelectedUserListReportQuery
} = selectedUserLisetReportApiSlice;