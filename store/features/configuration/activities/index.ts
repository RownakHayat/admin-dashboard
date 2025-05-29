import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const activitiesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Activities"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getActivitiesPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/activity-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["Activities"],
      }),
      getAllActivities: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-activity-list",
        }),
        providesTags: ["Activities"],
      }),
      createActivities: builder.mutation({
        query: (data) => ({
          url: "/auth/activity-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
      changeActivitiesStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/activity-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
      activitiesUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/activity-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetActivitiesPaginationQuery,
  useGetAllActivitiesQuery,
  useCreateActivitiesMutation,
  useChangeActivitiesStatusMutation,
  useActivitiesUpdateMutation,
} = activitiesApiSlice;
