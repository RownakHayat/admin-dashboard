import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const clusterApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["cluster"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getClusterPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/cluster-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["cluster"],
      }),
      getAllCluster: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-cluster-list",
        }),
        providesTags: ["cluster"],
      }),
      createCluster: builder.mutation({
        query: (data) => ({
          url: "/auth/cluster-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["cluster"],
      }),
      changeClusterStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/cluster-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["cluster"],
      }),
      clusterUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/cluster-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["cluster"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetClusterPaginationQuery,
  useGetAllClusterQuery,
  useCreateClusterMutation,
  useChangeClusterStatusMutation,
  useClusterUpdateMutation,
} = clusterApiSlice;
