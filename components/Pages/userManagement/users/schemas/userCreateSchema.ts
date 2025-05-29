import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().min(1, { message: "This field is required" }),
  mobile: z.string().min(1, { message: "This field is required" }),
  password: z.string().min(1, { message: "This field is required" }),
  confirm_password: z.string().min(1, { message: "This field is required" }),
  user_role_id: z.string().min(1, { message: "This field is required" }),
  user_name: z.string().nullable(),
  user_type_id: z.string().nullable(),
});

export const UsersRollSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  // roles_id: z.array(z.string()),
  roles_id: z.string().min(1, { message: "This field is required" }),
  // roles_id: z.array(z.string()).min(1, { message: "At least one role must be selected" }),
})