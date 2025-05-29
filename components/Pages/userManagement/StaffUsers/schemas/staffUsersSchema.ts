import { z } from "zod";

export const StaffUsersSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  wing_ids: z.array(z.string().min(1, { message: "Wing is required" })).min(1, {
    message: "At least one wing must be selected",
  }),

  sme_office_id: z.string().min(1, { message: "Id is required" }),
  mobile: z
    .string()
    .min(11, { message: "Mobile number must be 11 characters long" })
    .refine((val) => /^01\d{9}$/.test(val), {
      message: "Please Enter a Valid Mobile No",
    }),
  email: z.string().min(1, { message: "Email is required" }),
});

export const StaffUsersRollSchema = z.object({
  id: z.number().nullable(),
  roles_id: z.string().min(1, { message: "Role  is required" }),
  name: z.string().nullable(),
});
