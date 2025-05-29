import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const linkableInformationAPISlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["LinkableInformation"] })
  .injectEndpoints({
    endpoints: (builder) => ({
    getLinkableInformationPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/linkable-information",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["LinkableInformation"],
      }),
      createLinkableInformation: builder.mutation({
        query: (data) => ({
          url: "/auth/linkable-information",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["LinkableInformation"],
      }),
      getAllLinkableInformation: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-linkable-information",
        }),
        providesTags: ["LinkableInformation"],
      }),
    //   changeNoticeStatus: builder.mutation({
    //     query: (data) => ({
    //       url: `/auth/notice-status-change/${data.id}`,
    //       method: "PATCH",
    //       body: data,
    //     }),
    //     invalidatesTags: ["EssentInfo"],
    //   }),
    linkableInformationUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/linkable-information/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["LinkableInformation"],
      }),
      linkableInformationDelete: builder.mutation({
        query: (id) => ({
          url: `/auth/linkable-information/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['LinkableInformation'],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetLinkableInformationPaginationQuery,
    useGetAllLinkableInformationQuery,
    useCreateLinkableInformationMutation,
    useLinkableInformationUpdateMutation,
    useLinkableInformationDeleteMutation,
 
} = linkableInformationAPISlice;
