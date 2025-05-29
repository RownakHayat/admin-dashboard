import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const industrialSectorApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["industrialSector"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getIndustrialSectorPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/business-sector-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["industrialSector"],
      }),
      getAllIndustrialSector: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-cluster-list",
        }),
        providesTags: ["industrialSector"],
      }),
      createIndustrialSector: builder.mutation({
        query: (data) => ({
          url: "/auth/business-sector-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["industrialSector"],
      }),
      changeIndustrialSectorStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/business-sector-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["industrialSector"],
      }),
      industrialSectorUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/business-sector-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["industrialSector"],
      }),
      businessIndustrialList: builder.query<any, void>({
        query: (params?: any) => ({
          url: "auth/get-all-business-sector-list",
        }),
        providesTags: ["industrialSector"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetIndustrialSectorPaginationQuery,
  useGetAllIndustrialSectorQuery,
  useCreateIndustrialSectorMutation,
  useChangeIndustrialSectorStatusMutation,
  useIndustrialSectorUpdateMutation,
  useBusinessIndustrialListQuery
} = industrialSectorApiSlice;
