import { z } from "zod";

export const genderSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
});
