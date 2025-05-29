import { apiSlice } from "@/store/features/apiSlice";
import { TransformResponse } from "@/store/utils";

export const newPaymentApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["PaymentList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNewPaymentPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/user-payment-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["PaymentList"],
      }),

      // cashPayment: builder.query<any, { id: string; total_payable: number }>({
      //   query: ({ id, total_payable }) => ({
      //     url: `/auth/after-payment/cash`,
      //     params: {
      //       event_application_id: id,
      //       amount: total_payable,
      //     },
      //   }),
      //   // transformResponse: TransformResponse,
      //   // providesTags: ["PaymentList"],
      // }),


      // cashPayment: builder.query<any, { gateway: string }>({
      //   query: ({ gateway }) => {
      //     return {
      //       url: `/auth/after-payment/${gateway}`,
      //     };
      //   },
      //   transformResponse: (response) => response,
      // }),

      cashPayment: builder.query<any, { gateway: string, event_application_id: string, amount: string, mobile?: string, transaction_id?: string,event_detail_id?:string }>({
        query: ({  gateway, event_application_id, amount, mobile, transaction_id,event_detail_id }) => ({
          url: `/auth/after-payment/${gateway}`,
          params: { event_application_id, amount,mobile,transaction_id,event_detail_id },
        }),
        transformResponse: (response) => response,
      }),



      paymentInfo: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/payment-info/${id}`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        providesTags: ["PaymentList"],
      }),


      // paymentInfo: builder.mutation({
      //   query: ({ data, id }) => ({
      //     url: `/auth/payment-info/${id}`,
      //     method: "POST",
      //     body: data,
      //   }),
      //   invalidatesTags: ["PaymentList"],
      // }),

      cashBankDraftPayment: builder.mutation({
        query: (data) => ({
          url: "/auth/cash-payment",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["PaymentList"],
      }),

    }),
    overrideExisting: true,
  });

export const {
  useGetNewPaymentPaginationQuery,
  usePaymentInfoQuery,
  useCashPaymentQuery,
  useCashBankDraftPaymentMutation
} = newPaymentApiSlice;
