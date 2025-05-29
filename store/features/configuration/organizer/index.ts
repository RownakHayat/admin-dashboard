import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const OrganizerApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["EventFormSetup"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getOrganizerPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/organizer-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["EventFormSetup"],
      }),
      getAllOrganizer: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-organizer-list",
        }),
        providesTags: ["EventFormSetup"],
      }),
      createOrganizer: builder.mutation({
        query: (data) => ({
          url: "/auth/organizer-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventFormSetup"],
      }),
      changeOrganizerStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/organizer-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["EventFormSetup"],
      }),
      organizerSetupUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/organizer-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["EventFormSetup"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetOrganizerPaginationQuery,
  useGetAllOrganizerQuery,
  useCreateOrganizerMutation,
  useChangeOrganizerStatusMutation,
  useOrganizerSetupUpdateMutation,
  
} = OrganizerApiSlice;
