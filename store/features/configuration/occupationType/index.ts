import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const occupationTypeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["occupationType"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getOccupationTypePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/occupation-type-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["occupationType"],
      }),
      getAllOccupationType: builder.query<any, void>({
        query: () => ({
          url: "/get-all-occupation-type-list",
        }),
        providesTags: ["occupationType"],
      }),
      createOccupationType: builder.mutation({
        query: (data) => ({
          url: "/auth/occupation-type-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["occupationType"],
      }),
      changeOccupationTypeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/occupation-type-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["occupationType"],
      }),
      occupationTypeUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/occupation-type-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["occupationType"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetOccupationTypePaginationQuery,
  useGetAllOccupationTypeQuery,
  useCreateOccupationTypeMutation,
  useChangeOccupationTypeStatusMutation,
useOccupationTypeUpdateMutation
} = occupationTypeApiSlice;
