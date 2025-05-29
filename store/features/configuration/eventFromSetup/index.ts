import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const EventFormSetupApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["EventFormSetup"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getEventFormSetupPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/event-form-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["EventFormSetup"],
      }),
      getAllEventFormSetup: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-event-form-list",
        }),
        providesTags: ["EventFormSetup"],
      }),
      createEventFormSetup: builder.mutation({
        query: (data) => ({
          url: "/auth/event-form-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventFormSetup"],
      }),
      changeEventFormSetupStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/event-form-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventFormSetup"],
      }),
      eventFormSetupUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/event-form-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventFormSetup"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetEventFormSetupPaginationQuery,
  useGetAllEventFormSetupQuery,
  useCreateEventFormSetupMutation,
  useChangeEventFormSetupStatusMutation,
  useEventFormSetupUpdateMutation,
} = EventFormSetupApiSlice;
