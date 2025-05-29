import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const newsApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["News"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNewsPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/news-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["News"],
      }),
      getAllNews: builder.query<any, void>({
        query: () => ({
          url: "/news",
        }),
        providesTags: ["News"],
      }),
      createNews: builder.mutation({
        query: (data) => ({
          url: "/auth/news-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["News"],
      }),
      changeNewsStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/news-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["News"],
      }),
      NewsUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/news-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["News"],
      }),
      newsDelete: builder.mutation({
        query: (id) => ({
          url: `/auth/news-delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['News'],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetNewsPaginationQuery,
  useGetAllNewsQuery,
  useCreateNewsMutation,
  useChangeNewsStatusMutation,
  useNewsUpdateMutation,
  useNewsDeleteMutation,
} = newsApiSlice;
