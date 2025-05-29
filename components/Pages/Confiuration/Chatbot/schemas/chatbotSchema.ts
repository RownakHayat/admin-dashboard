import { z } from "zod";

export const chatbotSchema = z.object({
  activity_category_id: z.string().min(1, { message: "This field is required" }),
  user_ids: z
      .array(z.string())
      .nullable(),
  
});
