import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const staffUsersApiSlice = apiSlice
    .enhanceEndpoints({ addTagTypes: ["StaffUsers"] })
    .injectEndpoints({
      endpoints: (builder) => ({
        getStaffUsersPagination: builder.query<any, void>({
          query: (params?: any) => ({
            url: "/auth/staff-user-list",
            params,
          }),
          transformResponse: TransformResponse,
          providesTags: ["StaffUsers"],
        }),
        getAllStaffUsers: builder.query<any, void>({
          query: () => ({
            url: "/staff-user-list",
          }),
          providesTags: ["StaffUsers"],
        }),
        createStaffUsers: builder.mutation({
          query: (data) => ({
            url: "/auth/staff-user-store",
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["StaffUsers"],
        }),
        changeStaffUsersStatus: builder.mutation({
          query: (data) => ({
            url: `/auth/staff-user-change-status/${data.id}`,
            method: "PATCH",
            body: data,
          }),
          invalidatesTags: ["StaffUsers"],
        }),
        StaffUsersUpdate: builder.mutation({
          query: (data) => ({
            url: `/auth/staff-user-update/${data.id}`,
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["StaffUsers"],
        }),
        StaffUsersDelete: builder.mutation({
          query: (id) => ({
            url: `/auth/staff-user-delete/${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: ['StaffUsers'],
        }),
        getSpecificStaffUser: builder.query<any, any | any>({
          query: (params?: any) => ({
            url: `/auth/show-specific-user-info/${params.id}`,
          }),
          providesTags: ["StaffUsers"],
        }),

        // getAllStaffUsersDropdown: builder.query<any, void>({
        //   query: () => ({
        //     url: "/auth/get-all-staff--list",
        //   }),
        //   transformResponse: TransformResponse,
        //   providesTags: ["StaffUsers"],
        // }),

        // getStaffUsersPagination: builder.query<any, void>({
        //   query: (params?: any) => ({
        //     url: "/auth/staff-user-list",
        //     params,
        //   }),
        //   transformResponse: TransformResponse,
        //   providesTags: ["StaffUsers"],
        // }),


        // getAllStaff: builder.query<any, void>({
        //   query: (params?: any) => ({
        //     url: "/auth/get-all-staff--list",
        //     params,
        //   }),
        //   transformResponse: TransformResponse,
        //   providesTags: ["StaffUsers"],
        // }),

        getAllStaffUser: builder.query<any, void>({
          query: () => ({
            url: "/auth/get-all-staff--list",
          }),
          providesTags: ["StaffUsers"],
        }),


      }),
      overrideExisting: true,
    });

export const {
  useGetStaffUsersPaginationQuery,
  useGetAllStaffUsersQuery,
  useCreateStaffUsersMutation,
  useChangeStaffUsersStatusMutation,
  useStaffUsersUpdateMutation,
  useStaffUsersDeleteMutation,
  useGetSpecificStaffUserQuery,
    useGetAllStaffUserQuery
} = staffUsersApiSlice;
