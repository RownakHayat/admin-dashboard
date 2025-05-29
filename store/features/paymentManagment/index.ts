import { apiSlice } from "@/store/features/apiSlice";
import { TransformResponse } from "@/store/utils";


export const newPaymentApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["AppliedUserList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNewPaymentAppliedPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/payment-applied-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["AppliedUserList"],
      }),
        changePaymentStatus: builder.mutation({
            query: (data) => ({
                url: `/auth/change-payment-status/${data.id}`,
                method: "GET",
            }),
            invalidatesTags: ["AppliedUserList"],
        }),
        changePayementReceiveStatus: builder.mutation({
          query: (data) => ({
            url: "/auth/change-payment-status",
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["AppliedUserList"],
        }),
        rejectPayementReceiveStatus: builder.mutation({
          query: (data) => ({
            url: "/auth/reject-payment",
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["AppliedUserList"],
        }),

      getPaymentHistoryStatus: builder.query<any, any>({
        query: (data) => ({
          url: `/auth/transaction/history/${data.event_application_id}/${data.user_id}`,
        }),
        providesTags: ["AppliedUserList"],
      }),
    }),

    overrideExisting: true,
  });

export const {
  useGetNewPaymentAppliedPaginationQuery,
    useChangePaymentStatusMutation,
    useChangePayementReceiveStatusMutation,
    useRejectPayementReceiveStatusMutation,
    useGetPaymentHistoryStatusQuery,

} = newPaymentApiSlice;
