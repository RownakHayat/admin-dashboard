import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const manufactureGoodsApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["manufactureGoodsList"] })
  .injectEndpoints({
    endpoints: (builder) => ({

      getAllManufactureGoodsList: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/get-all-manufactured-goods-list"
        }),
        providesTags: ["manufactureGoodsList"],
      }),


    }),
    overrideExisting: true,
  });

export const {
  useGetAllManufactureGoodsListQuery,
} = manufactureGoodsApiSlice;
