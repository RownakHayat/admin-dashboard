import { TransformResponse } from "@/store/utils"
import { apiSlice } from "../apiSlice"

export const HelpDeskApiSlice = apiSlice.enhanceEndpoints({ addTagTypes: ["ChatbotData"], })
  .injectEndpoints({
    endpoints: (builder) => ({
      conversationUser: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: "/auth/conversation-users",
            params,
          }
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["ChatbotData",],
      }),

      getConversation: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: `/auth/conversation-show/${params?.id}`,
            params,
          }
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["ChatbotData",],
      }),

      getConversationFiles: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: `/auth/conversation-files/${params?.user_id}`,
          }
        },
        providesTags: ["ChatbotData",],
      }),

      getConversationLinks: builder.query<any, void | any>({
        query: (params?: any) => {
          return {
            url: `/auth/conversation-links/${params?.user_id}`,
          }
        },
        providesTags: ["ChatbotData",],
      }),

      chatNotification: builder.query<any, void | any>({
        query: () => {
          return {
            url: "/auth/conversation-notification",
          }
        },
        providesTags: ["ChatbotData",],
      }),


      //sazith api integration from here
      getAllStaffConversationUser: builder.query<any, void>({
        query: () => ({
          url: "/auth/staff-conversation-user",
        }),
        providesTags: ["ChatbotData"],
      }),

      storeConversation: builder.mutation({
        query: (data) => ({
          url: `/auth/conversation-store`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["ChatbotData"],
      }),

      getHelpdeskConversation: builder.query<any, any>({
        query: (params?: any) => ({

          url: `/auth/conversation-show`,
          params,
          
        }),
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["ChatbotData"],
      }),

    }),
    overrideExisting: true,
  })

export const {
  useConversationUserQuery,
  useGetConversationQuery,
  useGetConversationFilesQuery,
  useGetConversationLinksQuery,
  useStoreConversationMutation,
  useChatNotificationQuery,
  useGetAllStaffConversationUserQuery,
  useGetHelpdeskConversationQuery
} = HelpDeskApiSlice
