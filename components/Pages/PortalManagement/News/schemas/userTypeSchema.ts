import { z } from "zod";

export const NewsSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  description: z.string().min(1, { message: "This field is required" }),
  reporter: z.string().nullable(),
  news_date: z.string().nullable(),
  image_path: z.string().min(1, { message: "This field is required" }),
  hyperlink: z.string().nullable(),
  source: z.string().nullable(),
});
