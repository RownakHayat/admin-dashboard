import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../apiSlice";

export const globalNotificationApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserBasedNotificationList", "NotificationCount"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserBasedNotificationList: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/get-notification-data",
          params,
        }),
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["UserBasedNotificationList"],
      }),

      getNotificationCount: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/get-notification-data-count",
          params,
        }),
        providesTags: ["NotificationCount"], // Helps with cache invalidation
      }),

      getSingleNotificationData: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/single-notification-view/${id}`,
          };
        },
        providesTags: ["UserBasedNotificationList"],
      }),
    }),

    overrideExisting: true,
  });

export const {
  useGetUserBasedNotificationListQuery,
  useGetNotificationCountQuery,
  useGetSingleNotificationDataQuery,
} = globalNotificationApiSlice;
