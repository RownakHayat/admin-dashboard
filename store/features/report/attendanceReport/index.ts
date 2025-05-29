import { apiSlice } from "../../apiSlice";

export const attendanceReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["AttendanceReportList", "AttendanceReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getAttendanceReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/attendance-report?financial_year_id=${params.financial_year_id}&event_detail_id=${params.event_detail_id}&program_detail_id=${params.program_detail_id}`,
          }
        },
        providesTags: ["AttendanceReportList", "AttendanceReportListPagination"],
      }),
      deleteAttendanceReport: builder.mutation({
        query: (id) => ({
          url: `/auth/attendance-delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["AttendanceReportList"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetAttendanceReportQuery,
  useDeleteAttendanceReportMutation
} = attendanceReportApiSlice;