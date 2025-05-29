import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const sliderApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["slider"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSliderPagination: builder.query<any, void>({
        query: (params?: any) => ({
          url: "/auth/slider-list",
          params,
        }),
        transformResponse: TransformResponse,
        providesTags: ["slider"],
      }),
      getAllSlider: builder.query<any, void>({
        query: () => ({
          url: "/slider",
        }),
        providesTags: ["slider"],
      }),
      createSlider: builder.mutation({
        query: (data) => ({
          url: "/auth/slider-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["slider"],
      }),
      changeSliderStatus: builder.mutation({
        query: (data) => ({
          url: `/auth/slider-status-change/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["slider"],
      }),
      SliderUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/slider-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["slider"],
      }),
      SliderDelete: builder.mutation({
        query: (id) => ({
          url: `/auth/slider-delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['slider'],
      }),


      getEventSliders: builder.query<any, void>({
        query: () => ({
          url: "/event-slider",
        }),
        providesTags: ["slider"],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetSliderPaginationQuery,
  useGetAllSliderQuery,
  useCreateSliderMutation,
  useChangeSliderStatusMutation,
  useSliderUpdateMutation,
  useSliderDeleteMutation,
    useGetEventSlidersQuery
} = sliderApiSlice;
