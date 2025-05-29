import { apiSlice } from "@/store/features/apiSlice";
import { TransformResponse } from "@/store/utils";

export const feedbackManagementApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["FeedbackManagementList"] })
  .injectEndpoints({
    endpoints: (builder) => ({

      getFbManagementListPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/feedback-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["FeedbackManagementList"],
      }),
      getFeedbackUserList: builder.query<any, any>({
        query: (params?: any) => ({
          url:  `/auth/events-feedback-list/${params?.id}`,
        }),
        transformResponse: TransformResponse,
        providesTags: ["FeedbackManagementList"],
      }),

    }),
    overrideExisting: true,
  });

export const {
  useGetFbManagementListPaginationQuery,
  useGetFeedbackUserListQuery,
  
} = feedbackManagementApiSlice;