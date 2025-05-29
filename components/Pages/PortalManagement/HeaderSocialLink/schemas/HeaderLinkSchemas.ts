import { z } from "zod";

export const HeaderLinkSchemas = z.object({
    social_link: z 
    .array(
        z.object({
            same_tab : z.string().min(1, { message: "This field is required" }),
            title :z.string().nullable(),
            icon_class :z.string().nullable(),
            link:z.string().nullable(),
        })
    )
    .optional(),
});
