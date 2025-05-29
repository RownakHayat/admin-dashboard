import { z } from "zod";

export const PaymentSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  event_name: z.string().nullable(),
  created_at: z.string().nullable(),
  activity: z.string().nullable(),
  program: z.string().nullable(),
});
