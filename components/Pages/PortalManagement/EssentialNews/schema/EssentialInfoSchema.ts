import { z } from "zod";

export const EssentialInfoSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  link: z.string().nullable(),
  link_icon: z.string().nullable().optional(),
});
