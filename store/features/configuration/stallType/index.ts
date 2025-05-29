import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const stallTypeAPISlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["StallType"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getStallTypePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/stall-type-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["StallType"],
      }),
      getAllStallType: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-stall-type-list",
        }),
        providesTags: ["StallType"],
      }),
      createStallType: builder.mutation({
        query: (data) => ({
          url: "/auth/stall-type-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["StallType"],
      }),
      displayStallType: builder.query<any, number | string>({
        query: (id) => ({
          url: `/auth/stall-type-show/${id}`,
        }),
        providesTags: ["StallType"],
      }),
      changeStallTypeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/stall-type-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["StallType"],
      }),
      stallTypeUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/stall-type-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["StallType"],
      }),
      stallTypeDelate: builder.query<any, any>({
        query: (data) => {
          return {
            url: `/auth/stall-type-delete/${data?.id}`,
          };
        },
        providesTags: ["StallType"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetStallTypePaginationQuery,
    useGetAllStallTypeQuery,
    useCreateStallTypeMutation,
    useDisplayStallTypeQuery,
    useChangeStallTypeStatusMutation,
    useStallTypeUpdateMutation,
    useStallTypeDelateQuery,
} = stallTypeAPISlice;
