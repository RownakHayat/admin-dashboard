import { apiSlice } from "../../apiSlice";

export const surveyReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["SurveyReportList", "SurveyReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getSurveyReport: builder.query<any, string>({
        query: (id) => ({
          url: `/auth/survey-report/${id}`,
        }),
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetSurveyReportQuery 
} = surveyReportApiSlice;