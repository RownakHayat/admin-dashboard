import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const documentApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["document"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDocumentPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/document-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["document"],
      }),
      getAllDocument: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-document-list",
        }),
        providesTags: ["document"],
      }),
      createDocument: builder.mutation({
        query: (data) => ({
          url: "/auth/document-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["document"],
      }),
      changeDocumentStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/document-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["document"],
      }),
      updateDocument: builder.mutation({
        query: (data) => ({
          url: `/auth/document-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["document"],
      }),
      deleteDocument: builder.mutation({
        query: (id) => ({
          url: `/auth/document-delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ["document"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetDocumentPaginationQuery,
  useGetAllDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useChangeDocumentStatusMutation,
  useDeleteDocumentMutation,
} = documentApiSlice;
