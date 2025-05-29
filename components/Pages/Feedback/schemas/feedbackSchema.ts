import { z } from "zod";

export const FeedbackSchema = z.object({
  event_id: z.string().min(1, { message: "This field is required" }),
  activity_type_id: z.string().min(1, { message: "This field is required" }),
  start_date: z.string().min(1, { message: "This field is required" }),
  end_date: z.string().min(1, { message: "This field is required" }),
  subject: z.string().min(1, { message: "This field is required" }),
  description: z.string().nullable(),
});
