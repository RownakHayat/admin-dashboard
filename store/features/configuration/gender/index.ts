import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const genderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["gender"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getGenderPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/gender-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["gender"],
      }),
      getAllGender: builder.query<any, void>({
        query: () => ({
          url: "/get-all-gender-list",
        }),
        providesTags: ["gender"],
      }),
      createGender: builder.mutation({
        query: (data) => ({
          url: "/auth/gender-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["gender"],
      }),
      changeGenderStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/gender-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["gender"],
      }),
      genderUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/gender-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["gender"],
      }),
      getAllGnderList: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/get-all-gender-list",
        }),
        providesTags: ["gender"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetGenderPaginationQuery,
  useGetAllGenderQuery,
  useCreateGenderMutation,
  useChangeGenderStatusMutation,
  useGenderUpdateMutation,
  useGetAllGnderListQuery,
} = genderApiSlice;
