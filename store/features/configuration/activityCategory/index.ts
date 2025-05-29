import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const activityCategoryApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Activities"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getActivityCategorysPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/activity-category-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["Activities"],
      }),
      getAllActivityCategory: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-activity-category-list",
        }),
        providesTags: ["Activities"],
      }),
      createActivityCategory: builder.mutation({
        query: (data) => ({
          url: "/auth/activity-category-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
      changeActivityCategoryStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/activity-category-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
      activityCaregoryUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/activity-category-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
      activityCategoryDelete: builder.mutation({
        query: (data) => ({
          url: `/auth/activity-category-delete/${data.id}`,
          method: "",
          body: data,
        }),
        invalidatesTags: ["Activities"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetActivityCategorysPaginationQuery,
    useGetAllActivityCategoryQuery,
    useCreateActivityCategoryMutation,
    useChangeActivityCategoryStatusMutation,
    useActivityCaregoryUpdateMutation,
    useActivityCategoryDeleteMutation,
  
} = activityCategoryApiSlice;
