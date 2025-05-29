import { z } from "zod";

export const NoticeSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  description: z.string().nullable(),
  notice_by: z.string().nullable(),
  notice_date: z.string().nullable(),
  hyperlink: z.string().nullable(),
  source: z.string().nullable(),
});
