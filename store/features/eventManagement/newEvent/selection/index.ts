import { apiSlice } from "@/store/features/apiSlice";
import { TransformResponse } from "@/store/utils";

export const selectionApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["SelectionList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getPerticipant: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/participant-list/${id}`,
          };
        },
        transformResponse: TransformResponse,
        providesTags: ["SelectionList"],
      }),

      createEvent: builder.mutation({
        query: (data) => ({
          url: "/auth/create-event",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SelectionList"],
      }),
      getAllFinancialYear: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-financial-year-list",
        }),
        providesTags: ["SelectionList"],
      }),
      updateProgram: builder.mutation({
        query: (data) => ({
          url: `/auth/program-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SelectionList"],
      }),
      /*Selected Participate List*/

      selectedParticipant: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/selected-list/${id}`,
          };
        },
        transformResponse: TransformResponse,
        providesTags: ["SelectionList"],
      }),

      selectParticipant: builder.mutation({
        query: (data) => ({
          url: "/auth/select-participant",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SelectionList"],
      }),

      /*Unselected List*/
      unSelectedParticipant: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/unselected-list/${id}`,
          };
        },
        transformResponse: TransformResponse,
        providesTags: ["SelectionList"],
      }),

      /*Reselect Participate from  Unselect*/
      reSelectParticipant: builder.mutation({
        query: (data) => ({
          url: "/auth/reselect-participant",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SelectionList"],
      }),

      /*Unselect Participate from  Select*/
      UnSelectParticipant: builder.mutation({
        query: (data) => ({
          url: "/auth/remove-from-selected",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SelectionList"],
      }),
      /*Wating Participants from select*/
      watingParticipant: builder.mutation( {
        query: (data:any) => ({
          url:"/auth/wait-participant",
          method:"POST",
          body:data,
        } ),
        invalidatesTags:["SelectionList"],
      } ),

      getWaitingParticipantList: builder.query<any, any>({
        query:(id)=>{
          return{
            url: `/auth/waiting-list/${id}`,
          }},
        transformResponse:TransformResponse,
        providesTags:["SelectionList"],
      }),

      getEventParticipantList: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/users-event-list/${id}`,
          };
        },
        transformResponse: TransformResponse,
        providesTags: ["SelectionList"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetPerticipantQuery,
  useCreateEventMutation,
  useGetAllFinancialYearQuery,
  useUpdateProgramMutation,
  useSelectedParticipantQuery,
  useSelectParticipantMutation,
  useUnSelectedParticipantQuery,
  useReSelectParticipantMutation,
  useUnSelectParticipantMutation,
  useWatingParticipantMutation,
  useGetWaitingParticipantListQuery,
  useGetEventParticipantListQuery,
} = selectionApiSlice;
