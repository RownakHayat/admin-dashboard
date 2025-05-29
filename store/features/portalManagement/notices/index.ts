import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const noticeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Notice"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNoticePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/notice-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["Notice"],
      }),
      getAllNotice: builder.query<any, void>({
        query: () => ({
          url: "/notice",
        }),
        providesTags: ["Notice"],
      }),
      createNotice: builder.mutation({
        query: (data) => ({
          url: "/auth/notice-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Notice"],
      }),
      changeNoticeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/notice-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Notice"],
      }),
      noticeUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/notice-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Notice"],
      }),
      noticeDelete: builder.mutation({
        query: (id) => ({
          url: `/auth/notice-delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Notice'],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetNoticePaginationQuery,
  useGetAllNoticeQuery,
  useCreateNoticeMutation,
  useChangeNoticeStatusMutation,
  useNoticeUpdateMutation,
  useNoticeDeleteMutation
} = noticeApiSlice;
