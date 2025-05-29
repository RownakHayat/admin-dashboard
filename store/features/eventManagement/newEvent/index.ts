import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const newEventApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["EventList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNewEvent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/new-event-list",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["EventList"],
      }),

      getRunningEvent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/running-event",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["EventList"],
      }),

      getAppliedEvent: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/applied-event",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["EventList"],
      }),

      createEvent: builder.mutation({
        query: (data) => ({
          url: "/auth/create-event",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),

      getAllFinancialYear: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-financial-year-list",
        }),
        providesTags: ["EventList"],
      }),
      updateProgram: builder.mutation({
        query: (data) => ({
          url: `/auth/program-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      applyEvent: builder.mutation({
        query: (data) => ({
          url: `/auth/event-wise-field-store/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      getSingleEventDetails: builder.query<any, any>({
        query: ({ data, id }) => {
          return {
            url: `/auth/event-wise-fields/${id}`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        providesTags: ["EventList"],
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
        providesTags: ["EventList"],
      }),

      getAllEventList: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-event-list",
        }),
        providesTags: ["EventList"],
      }),
      getAllEventListField: builder.query<any, void>({
        query: () => ({
          url: "/auth/field-list",
        }),
        providesTags: ["EventList"],
      }),

      updateEventUserProfile: builder.mutation({
        query: (data) => ({
          url: "/auth/apply-event",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),

      publishEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/publish-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),

      updateSpecificEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/program-detail-show/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      getCategoryWiseAllField: builder.query<any, void>({
        query: () => ({
          url: "/auth/category-wise-all-fields",
        }),
        providesTags: ["EventList"],
      }),
      getEventUpdateSingleView: builder.query<any, any | void>({
        query: (params?: any) => ({
          url: `/auth/event-detail-show/${params.id}`,
        }),
        providesTags: ["EventList"],
      }),
      getEventDetailsSingleView: builder.query<any, any | void>({
        query: (id) => ({
          url: `/event-detail-show/${id}`,
        }),
        providesTags: ["EventList"],
      }),

      singleEventPostPone: builder.mutation({
        query: (data: any) => ({
          url: `/auth/postpone-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      reOpenEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/reopen-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      cancelEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/cancel-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      completeEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/complete-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      closeEvent: builder.mutation({
        query: (data: any) => ({
          url: `/auth/close-event/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      fairSaleStatusChange: builder.mutation({
        query: (data: any) => ({
          url: `/auth/fair-sale-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      feedBackStatusChange: builder.mutation({
        query: (data: any) => ({
          url: `/auth/feedback-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventList"],
      }),
      getEventCount: builder.query<any, void>({
        query: () => ({
          url: "/auth/user-event-count",
        }),
        providesTags: ["EventList"],
      }),

    }),
    overrideExisting: true,
  });

export const {
  useGetNewEventQuery,
  useGetRunningEventQuery,
  usePublishEventMutation,
  useCreateEventMutation,
  useGetAllFinancialYearQuery,
  useUpdateProgramMutation,
  useGetAllEventListQuery,
  useUpdateSpecificEventMutation,
  useGetCategoryWiseAllFieldQuery,
  useApplyEventMutation,
  useGetSingleEventDetailsQuery,
  useGetAllEventListFieldQuery,
  useUpdateEventUserProfileMutation,
  useGetAppliedEventQuery,
  useGetEventUpdateSingleViewQuery,
  useGetEventDetailsSingleViewQuery,
  useSingleEventPostPoneMutation,
  useReOpenEventMutation,
  useCancelEventMutation,
  useCompleteEventMutation,
  useCloseEventMutation,
  useFairSaleStatusChangeMutation,
  useFeedBackStatusChangeMutation,
  useGetEventCountQuery,


} = newEventApiSlice;
