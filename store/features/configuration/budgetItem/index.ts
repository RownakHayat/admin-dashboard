import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const BudgetTimeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["BudgetItem"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBudgetTimePagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/budget-item-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["BudgetItem"],
      }),
      getAllBudgetItem: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-budget-item-list",
        }),
        providesTags: ["BudgetItem"],
      }),
      getAllBudgetItemWiseUnit: builder.query<any, any | void>({
        query: (params?: any): any => ({
          url: `/auth/get-all-budget-item-wise-unit/${params?.id}`,
        }),
        providesTags: ["BudgetItem"],
      }),
      createBudgetTime: builder.mutation({
        query: (data) => ({
          url: "/auth/budget-item-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["BudgetItem"],
      }),
      changeBudgetTimeStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/budget-item-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["BudgetItem"],
      }),
      BudgetTimeUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/budget-item-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["BudgetItem"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetBudgetTimePaginationQuery,
  useGetAllBudgetItemWiseUnitQuery,
  useGetAllBudgetItemQuery,
  useCreateBudgetTimeMutation,
  useChangeBudgetTimeStatusMutation,
  useBudgetTimeUpdateMutation,
} = BudgetTimeApiSlice;
