import { apiSlice } from "../../apiSlice";
import { TransformResponse } from "@/store/utils";

export const wingSectionApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["wingSection"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getWingSectionPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/wing-section-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["wingSection"],
      }),
      getAllWingSection: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-wing-section-list",
        }),
        providesTags: ["wingSection"],
      }),
      createWingSection: builder.mutation({
        query: (data) => ({
          url: "/auth/wing-section-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["wingSection"],
      }),
      changeWingSectionStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/wing-section-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["wingSection"],
      }),
      wingSectionUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/wing-section-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["wingSection"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetWingSectionPaginationQuery,
  useGetAllWingSectionQuery,
  useCreateWingSectionMutation,
  useChangeWingSectionStatusMutation,
  useWingSectionUpdateMutation
} = wingSectionApiSlice;
