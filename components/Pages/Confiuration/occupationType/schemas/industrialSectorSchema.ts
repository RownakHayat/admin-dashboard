import { z } from "zod";

export const industrialSectorSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
});
