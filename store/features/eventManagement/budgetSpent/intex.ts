import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const budgetSpentApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["BudgetSpent"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBudgetSpent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/budget-spent-list",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["BudgetSpent"],
      }),
      createBudgetSpent: builder.mutation({
        query: (data) => ({
          url: "/auth/budget-spent",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["BudgetSpent"],
      }),
      budgetSpentEdit: builder.mutation({
        query: (data) => ({
          url: `/auth/budget-spent`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["BudgetSpent"],
      }),

      getSingleBudgetSpan: builder.query<any, any>({
        query: ({ data, id }) => {
          return {
            url: `/auth/budget-spent-seingle-detail/${id}`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        providesTags: ["BudgetSpent"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetBudgetSpentQuery,
  useCreateBudgetSpentMutation,
  useBudgetSpentEditMutation,
  useGetSingleBudgetSpanQuery,
} = budgetSpentApiSlice;
