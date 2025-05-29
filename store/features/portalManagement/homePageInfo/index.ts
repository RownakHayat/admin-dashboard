import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const homePageApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["HomePageInfo"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllHomePageInfo: builder.query<any, void>({
        query: () => ({
          url: "/frontend/show-homepage-info",
        }),
        providesTags: ["HomePageInfo"],
      }),
      updateSliderSitting: builder.mutation({
        query: (data) => ({
          url: "/auth/information-update",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["HomePageInfo"],
      }),
      updateHeaderSocialLink: builder.mutation({
        query: (data) => ({
          url: "/auth/header-social-link-update",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["HomePageInfo"],
      }),
      changeHeaderSocialLinkStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/header-social-link-status/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["HomePageInfo"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetAllHomePageInfoQuery,
  useUpdateSliderSittingMutation,
  useUpdateHeaderSocialLinkMutation,
  useChangeHeaderSocialLinkStatusMutation,
} = homePageApiSlice;
