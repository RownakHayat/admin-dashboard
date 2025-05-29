import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const eventManagementAttendanceApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["SMEId"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAttendanceList: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/attendance-list",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
      }),

      getSMEId: builder.query<any, string>({
        query: (mobile) => {
          return {
            url: `/auth/get-mobile-wise-smeid/${mobile}`,
          };
        },
      }),
      getSMEIdQrCode: builder.query<any, string>({
        query: (id) => ({
          url: `/auth/generate-qr-code/${id}`,
        }),
      }),

      createSmeId: builder.mutation({
        query: (formData) => ({
          url: "/auth/smeid-wise-attendance-store",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: ["SMEId"],
      }),

      createSmeId1: builder.mutation({
        query: (formData: FormData) => ({
          url: "/auth/smeid-wise-attendance-store",
          method: "POST",
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data', // Optional; FormData usually sets this automatically
          },
        }),
        invalidatesTags: ["SMEId"],
      }),

      getEventWiseAttenenceReportList: builder.query<any, any>({
        query: (id) => ({
          url: `/auth/attendance-report-list/${id}`,
        }),
      }),

    }),
    overrideExisting: true,
  });

export const {
  useGetAttendanceListQuery,
  useGetSMEIdQuery,
  useGetSMEIdQrCodeQuery,
  useCreateSmeIdMutation,
  useCreateSmeId1Mutation,
  useGetEventWiseAttenenceReportListQuery

} = eventManagementAttendanceApiSlice;
