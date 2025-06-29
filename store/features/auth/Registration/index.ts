
import { apiSlice } from "../../apiSlice";



export const NewRegister = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["NewRegistration"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      registration: builder.mutation({
        query: (data) => ({
          url: "/auth/registration",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["NewRegistration"],
      }),
      otpRegistration: builder.mutation({
        query: (data) => ({
          url: "/auth/verify-otp",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["NewRegistration"],
      }),
      otpResend: builder.mutation({
        query: (data) => ({
          url: "/auth/resend-otp",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["NewRegistration"],
      }),
      forgetPassword: builder.mutation({
        query: (data) => ({
          url: "/auth/forget-password",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["NewRegistration"],
      }),
      resetPassword: builder.mutation({
        query: (data) => ({
          url: "/auth/forget-password",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["NewRegistration"],
      }),
      resetPasswordInfo: builder.mutation({
        query: (data) => ({
          url: "/auth/reset-password-info",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["NewRegistration"],
      }),
    }),
  });

export const {  
    useRegistrationMutation,
    useOtpRegistrationMutation,
    useOtpResendMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
    useResetPasswordInfoMutation
} = NewRegister;
