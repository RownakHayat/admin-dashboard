import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const headerFooterPageApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["HeaderFooter"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getReportDetail: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-report-detail",
        }),
        providesTags: ["HeaderFooter"],
      }),
      updateReportDetail: builder.mutation({
        query: (data) => ({
          url: "/auth/update-report-detail",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["HeaderFooter"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetReportDetailQuery,
    useUpdateReportDetailMutation,
} = headerFooterPageApiSlice;
