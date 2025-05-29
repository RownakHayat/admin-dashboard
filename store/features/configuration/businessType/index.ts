import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const businessTypeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["designation"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBusinessTypePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/service-type-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["designation"],
      }),
      createBusinessType: builder.mutation({
        query: (data) => ({
          url: "/auth/service-type-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["designation"],
      }),
      updateBusinessType: builder.mutation({
        query: (data) => ({
          url: `/auth/service-type-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["designation"],
      }),
      changeBusinessTypeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/service-type-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["designation"],
      }),

      getAllServiceTypeList: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/get-all-service-type-list"
        }),
        providesTags: ["designation"],
      }),


      // getAllDesignation: builder.query<any, void>({
      //   query: () => ({
      //     url: "/auth/get-all-designation-list",
      //   }),
      //   providesTags: ["designation"],
      // }),
    }),
    overrideExisting: true,
  });

export const {
  useGetBusinessTypePaginationQuery,
  useCreateBusinessTypeMutation,
  useUpdateBusinessTypeMutation,
  // useGetAllDesignationQuery,
  useChangeBusinessTypeStatusMutation,
  useGetAllServiceTypeListQuery,
} = businessTypeApiSlice;
