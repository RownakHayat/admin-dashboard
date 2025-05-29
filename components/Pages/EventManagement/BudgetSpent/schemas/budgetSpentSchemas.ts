import { z } from "zod";

export const budgetSpentSchemas = z.object({
  id: z.number().nullable(),
  event_name: z.string().nullable(),
  program_detail_id: z.string().nullable(),
  venue: z.string().nullable(),
  division_id: z.string().nullable(),
  district_id: z.string().nullable(),
  spent_amount: z.string().min(1, { message: "The Spent Amount is required" }),
  event_status: z.string().nullable(),
});
