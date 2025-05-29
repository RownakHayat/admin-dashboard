import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../apiSlice";

export const homePageApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["homePage"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getHomeData: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/frontend/show-homepage-info",
            params,
          };
        },
        // transformResponse: (response) => TransformResponse(response),
      }),
      // allRunningEvent: builder.query<any, void>({
      //   query: (params?: any) => {
      //     return {
      //       // url: "/all-running-event",
      //       url: `/all-running-event?page=${params.page}&limit=${params.limit}&sortBy=${params.sortBy}&orderBy=${params.orderBy}`,
      //       params,
      //     };
      //   },
      //   transformResponse: (response) => TransformResponse(response),
      //   providesTags: ["homePage"],
      // }),

      getPrivacyData: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "privacy/policy",
            params,
          };
        },
      }),

      allRunningEvent: builder.query<any, any | void>({
        query: (params?: any) => {
          return {
            url: `/all-running-event`,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["homePage"],
      }),
      allRunningEventAuth: builder.query<any, any | void>({
        query: (params?: any) => {
          return {
            url: `/auth/user-wise-all-running-event`,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["homePage"],
      }),

      getFairSalesView: builder.query<any, void>({
        query: (id) => ({
          url: `/auth/event-detail-show/${id}`,
        }),
        providesTags: ["homePage"],
      }),
      getServicesCard: builder.query<any, void>({
        query: (id) => ({
          url: "/event-category-summary",
        }),
        providesTags: ["homePage"],
      }),

      getSingleServicesCard: builder.query<any, any>({
        query: (id : any) => ({
          url: `/event-category-summary/${id}`,
        }),
        providesTags: ["homePage"],
      }),


      getAllFinancialYearHome: builder.query<any, void>({
        query: () => ({
          url: "/get-all-financial-year-list-for-frontend",
        }),
        providesTags: ["homePage"],
      }),
      // api/activity-category-wise-running-event/{category_id}/{financial_year_id}

      getCategoryWiseRunningEvent: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/activity-category-wise-running-event/${id}`,
          };
        },
        transformResponse: TransformResponse,
        providesTags: ["homePage"],
      }),

      getCategoryWiseRunningEventUpdate: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/activity-category-wise-running-event/${id}/0`,
          };
        },
        transformResponse: TransformResponse,
        providesTags: ["homePage"],
      }),

      getCategoryWiseRunningEventHome: builder.query<any, any>({
        query: (params?: any) => {
          return {
            url: `/frontend-activity-category-wise-running-event/${params?.id}/${params.listIds}`,
          };
        },
        providesTags: ["homePage"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useAllRunningEventQuery,
  useAllRunningEventAuthQuery,
  useGetHomeDataQuery,
  useGetPrivacyDataQuery,
  useGetAllFinancialYearHomeQuery,
  useGetSingleServicesCardQuery,
  useGetFairSalesViewQuery,
  useGetServicesCardQuery,
  useGetCategoryWiseRunningEventQuery,
  useGetCategoryWiseRunningEventUpdateQuery,
  useGetCategoryWiseRunningEventHomeQuery
} = homePageApiSlice;
