import { apiSlice } from "../../apiSlice";

export const mobileChangeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["MobileNumber"] })
  .injectEndpoints({
    endpoints: (builder) => ({
     
      mobilePhoneNumberChange: builder.mutation({
        query: (data) => ({
          url: "/auth/user-mobile-change-sent-otp",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["MobileNumber"],
      }),
      mobilePhoneOtpNumber: builder.mutation({
        query: (data) => ({
          url: "/auth/user-mobile-change-sent-otp-verify",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["MobileNumber"],
      }),
     
    }),
    overrideExisting: true,
  });

export const {
  useMobilePhoneNumberChangeMutation,
  useMobilePhoneOtpNumberMutation
} = mobileChangeApiSlice;
