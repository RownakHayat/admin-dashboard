import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const usersRollApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["UsersRole"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUsersRollPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/user-roles",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["UsersRole"],
      }),
      getAllUsersRoll: builder.query<any, void>({
        query: () => ({
          url: "/auth/user-roles",
        }),
        providesTags: ["UsersRole"],
      }),
      createUsersRoll: builder.mutation({
        query: (data) => ({
          url: "/auth/user-roles",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UsersRole"],
      }),
      UsersRollUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-roles/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["UsersRole"],
      }),
      UsersRollDelete: builder.mutation({
        query: (id) => ({
          url: `/auth/user-roles/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UsersRole"],
      }),
      getAllUsersRollpERMISSION: builder.query<any, void>({
        query: () => ({
          url: "/auth/user/assign-roles-list",
        }),
        providesTags: ["UsersRole"],
      }),

      getAllUserspERMISSION: builder.query<any, void>({
        query: () => ({
          url: "/auth/user/permissions",
        }),
        providesTags: ["UsersRole"],
      }),

      userAssignPermission: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/auth/user/assign-permission/${id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UsersRole"],
      }),
      getSingleUserRolePermission: builder.query<any, any>({
        query: ({ data, id }) => {
          return {
            url: `/auth/user/permissions/${id}`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        providesTags: ["UsersRole"],
      }),
      getUsersAssignRollPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/user-role-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["UsersRole"],
      }),
      getAllActiveUsersRoll: builder.query<any, void>({
        query: () => ({
          url: "/auth/user-roles",
        }),
        providesTags: ["UsersRole"],
      }),
      userStaffRoleAssignPermission: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/auth/user/assign-roles/${id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UsersRole"],
      }),

      changeUsersRollStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/role-status-change/${data?.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["UsersRole"],
      }),

      getAllActiveUsersRollList: builder.query<any, void>({
        query: () => ({
          url: "/auth/user-roles/list",
        }),
        providesTags: ["UsersRole"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetUsersRollPaginationQuery,
  useGetAllUsersRollQuery,
  useCreateUsersRollMutation,
  useUsersRollUpdateMutation,
  useUsersRollDeleteMutation,
  useGetAllUsersRollpERMISSIONQuery,
  useUserAssignPermissionMutation,
  useGetSingleUserRolePermissionQuery,
  useGetAllUserspERMISSIONQuery,
  useGetUsersAssignRollPaginationQuery,
  useGetAllActiveUsersRollQuery,
  useUserStaffRoleAssignPermissionMutation,
  useChangeUsersRollStatusMutation,
  useGetAllActiveUsersRollListQuery,
} = usersRollApiSlice;
