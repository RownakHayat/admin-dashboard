import { apiSlice } from "@/store/features/apiSlice";
import { TransformResponse } from "@/store/utils";

export const surveyApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["FeedbackList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getFeedbackListPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/user-feedback-list-index",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["FeedbackList"],
      }),
      // getSpecificSurveyQuestinData: builder.query<any, string>({
      //   query: (id) => ({
      //     url: `/auth/survey/${id}`,
      //   }),
      // }),
      createFeedback: builder.mutation({
        query: (data) => ({
          url: "auth/user-feedback-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["FeedbackList"],
      }),
      getAllParticipateSurveyPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/all-participate-survey",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["FeedbackList"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetFeedbackListPaginationQuery,
  useCreateFeedbackMutation,
  useGetAllParticipateSurveyPaginationQuery
} = surveyApiSlice;