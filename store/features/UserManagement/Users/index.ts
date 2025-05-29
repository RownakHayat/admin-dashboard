import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const userssApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Users"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUsersPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/user-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["Users"],
      }),
      getAllUsers: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-auth-user-data",
        }),
        providesTags: ["Users"],
      }),
      createUsers: builder.mutation({
        query: (data) => ({
          url: "/auth/user-create",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Users"],
      }),
      changeUsersStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/user-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Users"],
      }),
      usersUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Users"],
      }),
      ratingUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/give-rating-to-user/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Users"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetUsersPaginationQuery,
  useGetAllUsersQuery,
  useCreateUsersMutation,
  useChangeUsersStatusMutation,
  useUsersUpdateMutation,
    useRatingUpdateMutation
} = userssApiSlice;
