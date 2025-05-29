import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const designationApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["designation"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDesignationPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/designation-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["designation"],
      }),
      getAllDesignation: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-designation-list",
        }),
        providesTags: ["designation"],
      }),
      createDesignation: builder.mutation({
        query: (data) => ({
          url: "/auth/designation-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["designation"],
      }),
      changeDesignationStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/designation-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["designation"],
      }),
      designationUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/designation-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["designation"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetDesignationPaginationQuery,
  useGetAllDesignationQuery,
  useCreateDesignationMutation,
  useChangeDesignationStatusMutation,
  useDesignationUpdateMutation
} = designationApiSlice;
