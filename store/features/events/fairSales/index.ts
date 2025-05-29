import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const eventFairSalesApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["EventFairSales"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEventFairSales: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/user-fair-sales",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
      }),

      getFairSalesView: builder.query<any, void>({
        query: (id) => ({
          url: `/auth/event-detail-show/${id}`,
        }),
        providesTags: ["EventFairSales"],
      }),

      updateFairSale: builder.mutation({
        query: (data) => ({
          url: `/auth/update-fair-sale/${data?.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventFairSales"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetEventFairSalesQuery,
  useGetFairSalesViewQuery,
  useUpdateFairSaleMutation,
} = eventFairSalesApiSlice;
