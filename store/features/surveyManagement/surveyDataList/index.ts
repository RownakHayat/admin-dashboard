import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

// export const eventManagementAttendanceApiSlice = apiSlice
export const surveyManagementDataListApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["SMEId"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSurveyList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/survey",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
      }),
   
      createSurvey: builder.mutation({
        query: (data) => ({
          url: "/auth/survey",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SMEId"],
      }),

      getProgramList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/get-all-program-list",
            params,
          };
        },
        providesTags: ["SMEId"],
      }),

      getEventDetailsList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/all-event-list",
            params,
          };
        },
        providesTags: ["SMEId"],
      }),

      getSpecificSurveyParticipateList: builder.query<any, any | void>({
        query: (params?: any) => {
          return {
            url: `/auth/survey-participate-list/${params.id}`,
          }
        },
        providesTags: ["SMEId"],
      }),

      getSpecificSurveyAnswerList: builder.query<any, any | void>({
        query: (params?: any) => {
          return {
            url: `/auth/survey-participate/${params.id}`,
          }
        },
        providesTags: ["SMEId"],
      }),

      updateSpecificSurvey: builder.mutation({
        query: (data) => ({
          url: `/auth/survey/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["SMEId"],
      }),
      financialYearWiseProgramUpdate: builder.query<any, any>({
        query: (params?: any) => {
          return {
            url: `/auth/financial-year-wise-program/${params?.id}`,
          };
        },
        providesTags: ["SMEId"],
      }),
      programWiseEventListUpdate: builder.query<any, any>({
        query: (params?: any) => {
          return {
            url: `/auth/program-wise-event/${params?.id}`,
          };
        },
        providesTags: ["SMEId"],
      }),


    }),
    overrideExisting: true,
  });

export const {
  useGetSurveyListQuery,
  useCreateSurveyMutation,
  useGetProgramListQuery,
  useGetEventDetailsListQuery,
  useGetSpecificSurveyParticipateListQuery,
  useGetSpecificSurveyAnswerListQuery,
  useUpdateSpecificSurveyMutation,
  useFinancialYearWiseProgramUpdateQuery,
  useProgramWiseEventListUpdateQuery,
} = surveyManagementDataListApiSlice;

