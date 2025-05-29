import { apiSlice } from "../../apiSlice";

export const paymentReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["PaymentReportList", "PaymentReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getPaymentReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/payment-report?financial_year_id=${params.financial_year_id}&event_detail_id=${params.event_detail_id}&program_detail_id=${params.program_detail_id}`,
          }
        },
        providesTags: ["PaymentReportList", "PaymentReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetPaymentReportQuery 
} = paymentReportApiSlice;