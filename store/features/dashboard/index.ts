import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../apiSlice";

export const dashboardApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Dashboard"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDashboardDivision: builder.query<any, any>({
        query: (data) => {
          return {
            url: `/auth/division-wise-event-list`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        // providesTags: ["Dashboard"],
      }),

      getNewEvent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/new-event-list",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["Dashboard"],
      }),

      getRunningEvent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/running-event",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["Dashboard"],
      }),

      getAppliedEvent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/applied-event",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["Dashboard"],
      }),

      createEvent: builder.mutation({
        query: (data) => ({
          url: "/auth/create-event",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Dashboard"],
      }),

      getAllFinancialYear: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-financial-year-list",
        }),
        providesTags: ["Dashboard"],
      }),
      updateProgram: builder.mutation({
        query: (data) => ({
          url: `/auth/program-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Dashboard"],
      }),
      applyEvent: builder.mutation({
        query: (data) => ({
          url: `/auth/event-wise-field-store/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Dashboard"],
      }),

      getSingleEventWiseDetails: builder.query<any, any>({
        query: ({ data, id }) => {
          return {
            url: `/auth/event-wise-fields/${id}`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        providesTags: ["Dashboard"],
      }),

      getAllEventList: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-event-list",
        }),
        providesTags: ["Dashboard"],
      }),
      getAllEventListField: builder.query<any, void>({
        query: () => ({
          url: "/auth/field-list",
        }),
        providesTags: ["Dashboard"],
      }),
      getDashboardFooterData: builder.query<any, void>({
        query: () => ({
          url: "/frontend/show-homepage-info",
        }),
        providesTags: ["Dashboard"],
      }),

      updateEventUserProfile: builder.mutation({
        query: (data) => ({
          url: "/auth/apply-event",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Dashboard"],
      }),

      publishEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/publish-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Dashboard"],
      }),

      updateSpecificEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/program-detail-show/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Dashboard"],
      }),
      getCategoryWiseAllField: builder.query<any, void>({
        query: () => ({
          url: "/auth/category-wise-all-fields",
        }),
        providesTags: ["Dashboard"],
      }),
      getEventUpdateSingleView: builder.query<any, any | void>({
        query: (params?: any) => ({
          url: `/auth/event-detail-show/${params.id}`,
        }),
        providesTags: ["Dashboard"],
      }),

      getDivisionEventListView: builder.query<any, any | void>({
        query: (params?: any) => ({
          url: params?.id
            ? `/auth/division-wise-event-list/${params.id}`
            : `/auth/division-wise-event-list`,
        }),
        providesTags: ["Dashboard"],
      }),

      getEventSurveyCount: builder.query<any, void>({
        query: () => ({
          url: "/auth/running-survey-event-count",
        }),
        providesTags: ["Dashboard"],
      }),
      getServicesSMEUser: builder.query<any, void>({
        query: () => ({
          url: "/event-category-summary/0",
        }),
        providesTags: ["Dashboard"],
      }),


    }),
    overrideExisting: true,
  });

export const {
  useGetNewEventQuery,
  usePublishEventMutation,
  useGetRunningEventQuery,
  useCreateEventMutation,
  useGetAllFinancialYearQuery,
  useUpdateProgramMutation,
  useGetAllEventListQuery,
  useUpdateSpecificEventMutation,
  useGetCategoryWiseAllFieldQuery,
  useApplyEventMutation,
  useGetDashboardDivisionQuery,
  useGetAllEventListFieldQuery,
  useUpdateEventUserProfileMutation,
  useGetAppliedEventQuery,
  useGetEventUpdateSingleViewQuery,
  useGetDivisionEventListViewQuery,
  useGetEventSurveyCountQuery,
  useGetDashboardFooterDataQuery,
  useGetServicesSMEUserQuery,
} = dashboardApiSlice;
