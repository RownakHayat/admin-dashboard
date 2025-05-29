import { apiSlice } from "../../apiSlice";
import { TransformResponse } from "@/store/utils";

export const userTypeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["UserType"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserTypePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/user-type-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["UserType"],
      }),
      getAllUserType: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-user-type-list",
        }),
        providesTags: ["UserType"],
      }),
      createUserType: builder.mutation({
        query: (data) => ({
          url: "/auth/user-type-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserType"],
      }),
      changeUserTypeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/user-type-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["UserType"],
      }),
      userTypeUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-type-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserType"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetUserTypePaginationQuery,
  useGetAllUserTypeQuery,
  useCreateUserTypeMutation,
  useUserTypeUpdateMutation,
  useChangeUserTypeStatusMutation,
} = userTypeApiSlice;
