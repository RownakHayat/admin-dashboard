import { z } from "zod";
export const forgetPasswordSchema = z.object({
    // mobile: z.string().min(1, { message: "This field is required" }
    mobile: z.string()
        .min(11, {message: "Mobile number must be 11 characters long"})
        .refine((val) => /^01\d{9}$/.test(val), {
            message: "Please Enter a Valid Mobile No",
        }),

  });