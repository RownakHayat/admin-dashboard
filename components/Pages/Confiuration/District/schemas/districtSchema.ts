import { z } from "zod";

export const districtSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  division_id: z.string().min(1, { message: "This field is required" }),
});
