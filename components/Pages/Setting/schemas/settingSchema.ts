import { z } from "zod";

export const SettingSchema = z.object({
  site_title: z.string().min(1, { message: "This field is required" }),
  address_title: z.string().min(1, { message: "This field is required" }),
  copy_right: z.string().min(1, { message: "This field is required" }),
  site_logo: z.string().min(1, { message: "This field is required" }),
  govt_logo: z.string().min(1, { message: "This field is required" }),
  meta_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  address_1: z.string().optional().nullable(),
  address_2: z.string().optional().nullable(),
  phone_other_details: z.string().optional().nullable(),
  map_source: z.string().min(1, { message: "This field is required" }),
});
