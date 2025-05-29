import { z } from "zod";

export const clusterSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
});
