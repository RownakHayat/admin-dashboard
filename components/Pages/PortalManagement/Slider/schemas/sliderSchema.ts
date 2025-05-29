import { z } from "zod";

export const SliderSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  description:z.string().nullable(),
  image_path:z.string().nullable(),
  // hyperlink:z.string().nullable(),
  // source:z.string().nullable()
});
