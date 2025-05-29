import { apiSlice } from "../../apiSlice";
import { TransformResponse } from "@/store/utils";

export const upazilaApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["upazila"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUpazillaPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/upazila-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["upazila"],
      }),
      getAllUpazilla: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-upazila-list",
        }),
        providesTags: ["upazila"],
      }),
      createUpazilla: builder.mutation({
        query: (data) => ({
          url: "/auth/upazila-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["upazila"],
      }),
      changeUpazillaStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/upazila-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["upazila"],
      }),
      upazillaUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/upazila-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["upazila"],
      }),
      districtWiseUpazila: builder.query<any, any>({
        query: (params?: any) => {
          return {
            url: `/auth/district-wise-upazila/${params?.id}`,
          };
        },
        providesTags: ["upazila"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetUpazillaPaginationQuery,
  useGetAllUpazillaQuery,
  useCreateUpazillaMutation,
  useChangeUpazillaStatusMutation,
  useUpazillaUpdateMutation,
  useDistrictWiseUpazilaQuery
} = upazilaApiSlice;
