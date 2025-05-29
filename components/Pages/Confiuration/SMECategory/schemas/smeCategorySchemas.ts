import { z } from "zod";

export const SMECategorySchemas = z.object({
  name: z.string().min(1, { message: "This field is required" }),
//   priority_no: z.string(),
});
