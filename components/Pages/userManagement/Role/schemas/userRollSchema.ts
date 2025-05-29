import { z } from "zod";

export const userRollSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
});
