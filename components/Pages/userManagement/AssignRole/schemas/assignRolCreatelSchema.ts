import { z } from "zod";

export const userAssignRollSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
});
