import { apiSlice } from "../../apiSlice";

export const eventOrganizedReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["EventOrganizedReportList", "EventOrganizedListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getEventOrganizedReportById: builder.query<any, any>({
        query: (id : any) => ({
          url: `/auth/event-organized-report/${id}`,
        }),
        providesTags: ["EventOrganizedReportList","EventOrganizedListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetEventOrganizedReportByIdQuery 
} = eventOrganizedReportApiSlice;