import { apiSlice } from "../../apiSlice";

export const smeUserListByApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserListByReport"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      // getUserListByReport: builder.query<any, void>({
      //   query: (params?: any) => {
      //     return {
      //       url: `/auth/sme-user-list-by-industry-sector-cluster-report?cluster_id=${params.cluster_id}&organization_type_id=${params.organization_type_id}&service_type_id=${params.service_type_id}`,
      //     }
      //   },
      //   providesTags: ["UserListByReport"],
      // }),
      getUserListByReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/sme-user-list-by-industry-sector-cluster-report?cluster_id=${params.cluster_id}&business_sector_id=${params.business_sector_id}&service_type_id=${params.service_type_id}`,
          }
        },
        providesTags: ["UserListByReport"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetUserListByReportQuery
} = smeUserListByApiSlice;