import { z } from "zod";

export const budgetItemsSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  unit: z.string().min(1, { message: "This field is required" }),
});
