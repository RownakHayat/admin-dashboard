import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const educationalQualificationApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["document"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEducationalQualificationPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/educational-qualification-list",
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
      createEducationalQualification: builder.mutation({
        query: (data) => ({
          url: "/auth/educational-qualification-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["document"],
      }),
      changeEducationalQualificationStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/educational-qualification-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["document"],
      }),
      updateEducationalQualification: builder.mutation({
        query: (data) => ({
          url: `/auth/educational-qualification-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["document"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetEducationalQualificationPaginationQuery,
  useGetAllDocumentQuery,
  useCreateEducationalQualificationMutation,
  useUpdateEducationalQualificationMutation,
  useChangeEducationalQualificationStatusMutation,
} = educationalQualificationApiSlice;
