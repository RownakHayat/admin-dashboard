import { apiSlice } from "../../apiSlice";

export const statisticalSMEUserInfoApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["StatisticalSMEUserInfo"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getStatisticalSmeUserInfoData: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/statistical-sme-user-information-report?cluster_id=${params.cluster_id}`,
          }
        },
        providesTags: ["StatisticalSMEUserInfo"],
      }),
    }),
    overrideExisting: true,
  });

export const {
    useGetStatisticalSmeUserInfoDataQuery
} = statisticalSMEUserInfoApiSlice;