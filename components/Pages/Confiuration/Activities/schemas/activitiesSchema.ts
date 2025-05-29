import { z } from "zod";

export const activitiesSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  name_bn: z.string().nullable(),
  activity_category_id: z.string().min(1, { message: "This field is required" }),
  priority_no: z.string().nullable(),
  
});
