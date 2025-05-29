import { z } from "zod";

export const formSchema = z.object({
  profile_image_path: z.string().optional().nullable(),
  name: z.string().min(3, { message: "This field is required" }),
  nid: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  signature_image_path: z.string().optional().nullable(),
  sme_office_id: z.string().optional().nullable(),
});
