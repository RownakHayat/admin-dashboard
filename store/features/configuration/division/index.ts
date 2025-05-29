import { apiSlice } from "../../apiSlice";
import { TransformResponse } from "@/store/utils";

export const divisionsApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["division"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDivisionPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/division-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["division"],
      }),
      getAllDivision: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-division-list",
        }),
        providesTags: ["division"],
      }),
      createDivision: builder.mutation({
        query: (data) => ({
          url: "/auth/division-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["division"],
      }),
      changeDivisionStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/division-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["division"],
      }),
      divisionUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/division-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["division"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetDivisionPaginationQuery,
  useGetAllDivisionQuery,
  useCreateDivisionMutation,
  useChangeDivisionStatusMutation,
  useDivisionUpdateMutation,
} = divisionsApiSlice;
