import { TransformResponse } from "@/store/utils"
import { apiSlice } from "../../apiSlice"

export const userProfileApiSlice = apiSlice.enhanceEndpoints({addTagTypes: ["UserProfileList"],})
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserProfilePagination: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: "/auth/user-profile-list",
            params,
          }
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["UserProfileList",],
      }),

      createUserProfile: builder.mutation({
        query: (data) => ({
          url: "/auth/user-profile-create",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserProfileList",],
      }),
      userAuthProfileShow: builder.query<any, any>({
        query: (data?: any) => {
          return {
            url: `/auth/show-specific-user-info/${data}`,
          };
        },
        providesTags: ["UserProfileList"],
      }),
     
      userProfileShow: builder.query<any, any>({
        query: (params?: any) => {
          return {
            url: `/auth/user-profile-show/${params.id}`,
          }
        },
        providesTags: ["UserProfileList",],
      }),
      
      changeUserProfileStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/user-profile-change-active-status/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["UserProfileList",],
      }),
      UserProfileUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-profile-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserProfileList"],
      }),
      ProfileUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/user-profile-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserProfileList"],
      }),
    }),
    overrideExisting: true,
  })

export const {
    useGetUserProfilePaginationQuery,
    useChangeUserProfileStatusMutation,
    useCreateUserProfileMutation,
    useUserProfileShowQuery,
    useProfileUpdateMutation,
    useUserProfileUpdateMutation,
    useUserAuthProfileShowQuery
} = userProfileApiSlice
