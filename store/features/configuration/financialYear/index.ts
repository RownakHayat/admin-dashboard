import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const financialYearApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["FinancialYear"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getFinancialYearPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/financial-year-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["FinancialYear"],
      }),
      getAllFinancialYear: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-financial-year-list",
        }),
        providesTags: ["FinancialYear"],
      }),
      createFinancialYear: builder.mutation({
        query: (data) => ({
          url: "/auth/financial-year-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["FinancialYear"],
      }),
      changeFinancialYearStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/financial-year-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["FinancialYear"],
      }),
      financialYearUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/financial-year-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["FinancialYear"],
      }),
      getYearProgramDataListView: builder.query<any, any | void>({
        query: (params?: any) => ({
          url: `/auth/program-progress/${params.id}`,
        }),
        providesTags: ["FinancialYear"],
      }),
      getYeearBudgetSummary: builder.query<any, any | void>({
        query: (params?: any) => ({
          url: `/auth/budget-summary/${params.id}`,
        }),
        providesTags: ["FinancialYear"],
      }),
      getYearProgramActivities: builder.query<any, any | void>({
        query: (params?: any) => ({
          url: `/auth/program-activities/${params.id}`,
        }),
        providesTags: ["FinancialYear"],
      }),

      mapData: builder.query<any, void>({
        query: () => ({
          url: "/auth/division-wise-event-list",
        }),
        providesTags: ["FinancialYear"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetFinancialYearPaginationQuery,
  useGetAllFinancialYearQuery,
  useCreateFinancialYearMutation,
  useChangeFinancialYearStatusMutation,
  useFinancialYearUpdateMutation,
  useGetYearProgramDataListViewQuery,
  useGetYearProgramActivitiesQuery,
  useGetYeearBudgetSummaryQuery,
  useMapDataQuery,
} = financialYearApiSlice;
