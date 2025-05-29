import { z } from "zod";

export const ChangeEmailFormSchema = z.object({
  // email: z.string().min(1, { message: "This field is required" }),
   email: z.string().email({ message: "Please enter a valid email address." }),
});

export const OtpSchema = z.object({
  otp_code: z.string().min(5, { message: "This field is required" }),
  email: z.string().min(1, { message: "This field is required" }),
});
