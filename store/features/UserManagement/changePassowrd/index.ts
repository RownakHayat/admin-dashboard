import { apiSlice } from "../../apiSlice";

export const passwordChangeApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["email"] })
  .injectEndpoints({
    endpoints: (builder) => ({
     
      passwordChange: builder.mutation({
        query: (data) => ({
          // url: "/auth/reset-password-info",
          url: "/auth/change-user-password",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["email"],
      }),
      mobileOtpNumber: builder.mutation({
        query: (data) => ({
          url: "/auth/reset-password-verify",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["email"],
      }),
     
    }),
    overrideExisting: true,
  });

export const {
    usePasswordChangeMutation,
    useMobileOtpNumberMutation,
} = passwordChangeApiSlice;
