import { apiSlice } from "../../apiSlice";

export const getSmeUserListByYearReportApiSlice = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["FairSaleReportList", "FairSaleReportListPagination"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({

      getSmeUserListByYearReport: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: `/auth/user-report?year=${params.year}&gender_id=${params.gender_id}&division_id=${params.division_id}&district_id=${params.district_id}&upazila_id=${params.upazila_id}`,
          }
        },
        providesTags: ["FairSaleReportList", "FairSaleReportListPagination"],
      }),
    }),
    overrideExisting: true,
  });

export const { 
  useGetSmeUserListByYearReportQuery 
} = getSmeUserListByYearReportApiSlice;