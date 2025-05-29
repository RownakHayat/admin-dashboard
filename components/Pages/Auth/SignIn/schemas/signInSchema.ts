import { z } from "zod";

export const signInSchema = z.object({
  mobile: z
    .string()
    .min(1, { message: "This field is required" })
    .min(11, { message: "Mobile number must be 11 characters long" })
    .refine((val) => /^01\d{9}$/.test(val), {
      message: "Please Enter a Valid Mobile No",
    }),
  password: z
    .string()
    .min(1, { message: "This field is required" })
    .min(6, { message: "The password must be at least 6 characters." }),
});
