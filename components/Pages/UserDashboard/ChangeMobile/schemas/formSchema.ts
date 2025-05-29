import { z } from "zod";

export const ChangeMobileNumberFormSchema = z.object({
  old_mobile_number: z.string().min(1, { message: "This field is required" }),
  new_mobile_number: z
      .string()
      .min(11, { message: "Mobile number must be 11 characters long" })
      .refine((val) => /^01\d{9}$/.test(val), {
        message: "Please Enter a Valid Mobile No",
      }),
});

export const OtpSchema = z.object({
  request_otp_code: z.string().min(5, { message: "This field is required" }),
  old_mobile: z.string().min(1, { message: "This field is required" }),
  new_mobile: z
      .string()
      .min(11, { message: "Mobile number must be 11 characters long" })
      .refine((val) => /^01\d{9}$/.test(val), {
        message: "Please Enter a Valid Mobile No",
      }),
});