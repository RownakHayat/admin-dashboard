import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const chatTropicsApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["chatTropics"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getChatTropicsPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/chat-topic-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["chatTropics"],
      }),
      getAllChatTropics: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-chat-topic-list",
        }),
        providesTags: ["chatTropics"],
      }),
      createChatTropics: builder.mutation({
        query: (data) => ({
          url: "/auth/chat-topic-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["chatTropics"],
      }),
      changeChatTropicsStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/chat-topic-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["chatTropics"],
      }),
      chatTropicsUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/chat-topic-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["chatTropics"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetChatTropicsPaginationQuery,
  useGetAllChatTropicsQuery,
  useCreateChatTropicsMutation,
  useChangeChatTropicsStatusMutation,
  useChatTropicsUpdateMutation,
} = chatTropicsApiSlice;
