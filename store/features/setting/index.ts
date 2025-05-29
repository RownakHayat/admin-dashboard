import { apiSlice } from "../apiSlice";

export const settingApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["settingUpdate"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      createSetting: builder.mutation({
        query: (data) => ({
          url: "/auth/information-update",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["settingUpdate"],
      }),

      SettingUpdate: builder.mutation({
        query: (data) => ({
          url: `/auth/information-update`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["settingUpdate"],
      }),
    }),
    overrideExisting: true,
  });

export const { useCreateSettingMutation, useSettingUpdateMutation } =
  settingApiSlice;
