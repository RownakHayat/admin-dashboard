import { z } from "zod";
export const OtpSchema = z.object({
    request_otp_code: z.string().min(5, { message: "This field is required" }),
    mobile: z.string().min(1, { message: "This field is required" })
  });