import { z } from "zod";

export const upazilaSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  district_id: z.string().min(1, { message: "This field is required" }),
});
