import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const userApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["UserList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserPagination: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/user-list",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["UserList"],
      }),

      getAllUser: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: "/auth/get-all-user-list",
          };
        },
        providesTags: ["UserList"],
      }),

      showSpecificsUser: builder.query<any, void | any>({
        query: (data?: any) => {
          return {
            url: `/auth/show-user-info/${data?.id}`,
          };
        },
        providesTags: ["UserList"],
      }),

      authUser: builder.query<any, void>({
        query: (data?: any) => {
          return {
            url: `/auth/user`,
          };
        },
        providesTags: ["UserList"],
      }),
      getOfficeWiseUser: builder.query<any, any | void>({
        query: (data?: any) => {
          return {
            url: `/auth/get-office-user-profile/${data?.id}`,
          };
        },
        providesTags: ["UserList"],
      }),

      createUser: builder.mutation({
        query: (data) => ({
          url: "/auth/user-create",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),

      changeUserStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/user-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),

      UserUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),

      getAssignUserProfile: builder.mutation({
        query: (data) => ({
          url: `/auth/get-assigned-article-profile-name`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),

      rollback: builder.mutation({
        query: (data) => ({
          url: `/auth/agreement-rollback/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),

      getUserRoles: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: "/auth/user-roles/list",
          };
        },
        providesTags: ["UserList"],
      }),
      getActiveUser: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: "/auth/get-active-user-user-id",
          };
        },
        providesTags: ["UserList"],
      }),

      assignRoleSpecificUser: builder.mutation({
        query: (data) => ({
          url: `/auth/user/assign-roles/${data?.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),
      updateAdminProfile: builder.mutation({
        query: (data) => ({
          url: "/auth/admin-profile-update",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),
      updateUserProfile: builder.mutation({
        query: (data) => ({
          url: "/auth/user-individual-profile-update",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserList"],
      }),

      viewUserProfile: builder.query<any, void | any>({
        query: (data?: any) => {
          return {
            url: `/auth/show-specific-user-info/${data}`,
          };
        },
        providesTags: ["UserList"],
      }),

      deleteImage: builder.mutation({
        query: (id) => ({
          url: `/auth/user-profile-attachement-delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UserList"],
      }),
      deleteUserProfileImage: builder.mutation({
        query: (id) => ({
          url: `/auth/user-profile-image-delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UserList"],
      }),
      deleteUserSignImage: builder.mutation({
        query: (id) => ({
          url: `/auth/user-profile-signature-delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UserList"],
      }),
    }),

    overrideExisting: true,
  });

export const {
  useGetUserPaginationQuery,
  useGetAllUserQuery,
  useAuthUserQuery,
  useGetOfficeWiseUserQuery,
  useShowSpecificsUserQuery,
  useCreateUserMutation,
  useUserUpdateMutation,
  useChangeUserStatusMutation,
  useGetAssignUserProfileMutation,
  useRollbackMutation,
  useGetUserRolesQuery,
  useGetActiveUserQuery,
  useAssignRoleSpecificUserMutation,
  useUpdateAdminProfileMutation,
  useUpdateUserProfileMutation,
  useDeleteImageMutation,
  useViewUserProfileQuery,
  useDeleteUserProfileImageMutation,
  useDeleteUserSignImageMutation,
} = userApiSlice;
