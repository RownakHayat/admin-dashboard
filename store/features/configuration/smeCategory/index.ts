import { apiSlice } from "../../apiSlice";
import { TransformResponse } from "@/store/utils";

export const smecategoryAPISlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["SMECategory"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSmeCategoryPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/sme-category-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["SMECategory"],
      }),
      getAllSmeCategory: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-sme-category-list",
        }),
        providesTags: ["SMECategory"],
      }),
      createSmeCategory: builder.mutation({
        query: (data) => ({
          url: "/auth/sme-category-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SMECategory"],
      }),
      changeSmeCategoryStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/sme-category-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["SMECategory"],
      }),
      smeCategoryUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/sme-category-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SMECategory"],
      }),
      smeCategoryDelate: builder.query<any, any>({
        query: (data) => {
          return {
            url: `/auth/sme-category-delete/${data?.id}`,
          };
        },
        providesTags: ["SMECategory"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetSmeCategoryPaginationQuery,
    useGetAllSmeCategoryQuery,
    useCreateSmeCategoryMutation,
    useChangeSmeCategoryStatusMutation,
    useSmeCategoryUpdateMutation,
    useSmeCategoryDelateQuery,
} = smecategoryAPISlice;
