import { z } from "zod";

// export const ChangePasswordFormSchema = z
//     .object({
//       mobile: z.string().min(1, { message: "This field is required" }),
//       password: z
//           .string()
//           .min(1, { message: "This field is required" })
//           .min(6, { message: "Password must be at least 6 characters long" })
//           .max(50, { message: "Password must be at most 50 characters long" })
//           .regex(/^[a-zA-Z0-9]+$/, {
//             message: "Password can only contain letters and numbers",
//           })
//           .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
//             message: "Password must contain at least one letter and one number",
//           }),
//       confirm_password: z.string().min(1, { message: "This field is required" }),
//     })
//     .refine((data) => data.password === data.confirm_password, {
//       path: ["confirm_password"],
//       message: "Passwords do not match",
//     });

export const ChangePasswordFormSchema = z.object({
  mobile: z.string().min(1, { message: "This field is required" }),
  old_password: z.string().min(1, { message: "This field is required" }),
  new_password: z
    .string()
    .min(1, { message: "This field is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Password can only contain letters and numbers",
    })
    .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
      message: "Password must contain at least one letter and one number",
    }),
});
