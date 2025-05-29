import { apiSlice } from "@/store/features/apiSlice";
import { TransformResponse } from "@/store/utils";

export const surveyApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["SurveyList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSurveyListPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/survey",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["SurveyList"],
      }),
      getSpecificSurveyQuestinData: builder.query<any, string>({
        query: (id) => ({
          url: `/auth/survey/${id}`,
        }),
      }),
      createParticipateSurvey: builder.mutation({
        query: (data) => ({
          url: "auth/survey-participate",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SurveyList"],
      }),
      getAllParticipateSurveyPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/all-participate-survey",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["SurveyList"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetSurveyListPaginationQuery,
  useGetSpecificSurveyQuestinDataQuery,
  useCreateParticipateSurveyMutation,
  useGetAllParticipateSurveyPaginationQuery
} = surveyApiSlice;