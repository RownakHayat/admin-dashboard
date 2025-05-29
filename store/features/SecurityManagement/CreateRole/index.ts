import { TransformResponse } from "@/store/utils"
import { apiSlice } from "../../apiSlice"

export const designationApiSlice = apiSlice.enhanceEndpoints({ addTagTypes: ["UserRolePagination", "UserRoleList", "UserRolePermissionList"], })
  .injectEndpoints({
    endpoints: (builder) => ({
      userRolePagination: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/user-roles",
            params,
          }
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["UserRolePagination", "UserRoleList"],
      }),
      getUserRolePermissionAllList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/user/permissions",
            params,
          }
        },
        providesTags: ["UserRolePermissionList"],
      }),
      getSingleUserRolePermission: builder.query<any, any>({
        query: ({data,id}) => {
          return {
            url: `/auth/user/permissions/${id}`,
          }
        },
        transformResponse: (response) => {
          return response
        },
        providesTags: ["UserRolePermissionList"],
      }),
      userRoleUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-roles/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: [
          "UserRolePagination",
          "UserRoleList",
        ],
      }),
      userRoleCreate: builder.mutation({
        query: (data) => ({
          url: "/auth/user-roles",
          method: "POST",
          body: data,
        }),
        invalidatesTags: [
          "UserRolePagination",
          "UserRoleList",
        ],
      }),
      userAssignPermission: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/auth/user/assign-permission/${id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: [
          "UserRolePagination",
          "UserRoleList",
          "UserRolePermissionList",
        ],
      }),
      userRolePermissionList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/user/assign-roles-list",
            params,
          }
        },
        providesTags: ["UserRolePermissionList"],
      }),

      userRoleStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/role-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: [
          "UserRolePagination",
          "UserRoleList",
        ],
      }),

    }),
    overrideExisting: true,
  })

export const {
  useUserRolePaginationQuery,
  useGetUserRolePermissionAllListQuery,
  useUserRoleUpdateMutation,
  useUserRoleCreateMutation,
  useGetSingleUserRolePermissionQuery,
  useUserAssignPermissionMutation,
  useUserRolePermissionListQuery,
  useUserRoleStatusMutation
} = designationApiSlice
