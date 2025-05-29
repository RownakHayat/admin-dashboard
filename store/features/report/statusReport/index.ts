import { apiSlice } from "../../apiSlice";

export const statusReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["StatusReportList", "StatusReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      generateStatusReport: builder.mutation({
        query: (data) => ({
          url: "/auth/report-mpr",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["StatusReportList"],
      }),

    }),
    overrideExisting: true,
  });

export const { 
  useGenerateStatusReportMutation
} = statusReportApiSlice;
