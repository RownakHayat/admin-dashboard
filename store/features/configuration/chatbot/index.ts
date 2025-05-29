import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const chatbotApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["Chatbot"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getChatbotPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/activity-category-wise-staff",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["Chatbot"],
      }),
      getAllChatbot: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-activity-list",
        }),
        providesTags: ["Chatbot"],
      }),
      createChatbot: builder.mutation({
        query: (data) => ({
          url: "/auth/assign-users-to-activity-category",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Chatbot"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetChatbotPaginationQuery,
  useGetAllChatbotQuery,
  useCreateChatbotMutation
} = chatbotApiSlice;
