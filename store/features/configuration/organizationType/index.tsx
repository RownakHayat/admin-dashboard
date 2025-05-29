import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const organizationTypeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["organizationTypeList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getOrganizationTypePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/organization-type-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["organizationTypeList"],
      }),
      createOrganizationType: builder.mutation({
        query: (data) => ({
          url: "/auth/organization-type-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["organizationTypeList"],
      }),
      updateOrganizationType: builder.mutation({
        query: (data) => ({
          url: `/auth/organization-type-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["organizationTypeList"],
      }),
      changeOrganizationTypeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/organization-type-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["organizationTypeList"],
      }),
      getAllOrganizationTypeList: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/get-all-organization-type-list"
        }),
        providesTags: ["organizationTypeList"],
      }),


    }),
    overrideExisting: true,
  });

export const {
  useGetAllOrganizationTypeListQuery,
  useGetOrganizationTypePaginationQuery,
  useCreateOrganizationTypeMutation,
  useUpdateOrganizationTypeMutation,
  useChangeOrganizationTypeStatusMutation
} = organizationTypeApiSlice;
