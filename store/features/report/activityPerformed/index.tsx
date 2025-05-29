import { apiSlice } from "../../apiSlice";

export const activityPerformedReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["ActivityPerformedReportList", "ActivityPerformedListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getActivityPerformedReportById: builder.query<any, any>({
        query: (id : any) => ({
          url: `/auth/activity-performed-report/${id}`,
        }),
        providesTags: ["ActivityPerformedReportList","ActivityPerformedListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetActivityPerformedReportByIdQuery 
} = activityPerformedReportApiSlice;