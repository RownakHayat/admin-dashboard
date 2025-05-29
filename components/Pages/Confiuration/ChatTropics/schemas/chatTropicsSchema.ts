import { z } from "zod";

export const chatTropicsSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
});
