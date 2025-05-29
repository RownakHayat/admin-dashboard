import { z } from "zod";

export const StallTypeSchemas = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  name_bn: z.string().optional().nullable(),
  stall_fare: z.string().min(1, { message: "This field is required" }),

//   priority_no: z.string(),
});
