import { z } from "zod";

export const formSchemas = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  name_bn: z.string().min(1, { message: "This field is required" }),
  banner:z.string().nullable(),
});
