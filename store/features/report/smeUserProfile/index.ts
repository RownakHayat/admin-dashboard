import { apiSlice } from "../../apiSlice";

export const smeUserProfileApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserProfileReport"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getUserProfileReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/sme-user-profile-report?sme_id=${params.sme_id}&name=${params.name}&mobile=${params.mobile}&email=${params.email}&division_id=${params.division_id}`,
          }
        },
        providesTags: ["UserProfileReport"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetUserProfileReportQuery
} = smeUserProfileApiSlice;