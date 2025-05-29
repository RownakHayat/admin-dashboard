import { z } from "zod";
export const ResetPasswordSchema = z.object({
  mobile: z
    .string()
    .min(11, { message: "Mobile number must be 11 characters long" })
    .refine((val) => /^01\d{9}$/.test(val), {
      message: "Please Enter a Valid Mobile No",
    }),
  request_otp_code: z.string().min(1, { message: "This field is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Password can only contain letters and numbers",
    })
    .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
      message: "Password must contain at least one letter and one number",
    }),
  confirm_password: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters long" })
    .max(50, {
      message: "Confirm Password must be at most 50 characters long",
    }),
});
