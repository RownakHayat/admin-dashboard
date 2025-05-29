import { apiSlice } from "../../apiSlice";

export const feedbackReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["FeedbackReportList", "FeedbackReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getFeedbackReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/feedback-report?event_detail_id=${params.event_detail_id}`,
          }
        },
        providesTags: ["FeedbackReportList", "FeedbackReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
    useGetFeedbackReportQuery
} = feedbackReportApiSlice;