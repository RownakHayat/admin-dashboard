import { apiSlice } from "../../apiSlice";
import { TransformResponse } from "@/store/utils";

export const districtsApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["district"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDistrictPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/district-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["district"],
      }),
      getAllDistrict: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-district-list",
        }),
        providesTags: ["district"],
      }),
      createDistrict: builder.mutation({
        query: (data) => ({
          url: "/auth/district-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["district"],
      }),
      changeDistrictStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/district-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["district"],
      }),
      districtUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/district-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["district"],
      }),
      divisionWiseDistrict: builder.query<any, any>({
        query: (params?: any) => {
          return {
            url: `/auth/division-wise-district/${params?.id}`,
          };
        },
        providesTags: ["district"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetDistrictPaginationQuery,
  useGetAllDistrictQuery,
  useCreateDistrictMutation,
  useChangeDistrictStatusMutation,
  useDistrictUpdateMutation,
  useDivisionWiseDistrictQuery,
} = districtsApiSlice;
