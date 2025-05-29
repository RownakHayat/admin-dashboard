import { apiSlice } from "../../apiSlice";

export const emailChangeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["email"] })
  .injectEndpoints({
    endpoints: (builder) => ({
     
      emailChange: builder.mutation({
        query: (data) => ({
          url: "/auth/sent-otp-in-mail",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["email"],
      }),
      emailOtpNumber: builder.mutation({
        query: (data) => ({
          url: "/auth/user-email-otp-verify",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["email"],
      }),
     
    }),
    overrideExisting: true,
  });

export const {
  useEmailChangeMutation,
  useEmailOtpNumberMutation
} = emailChangeApiSlice;
