import { z } from "zod";

export const sliderSittingSchemas = z.object({
    site_title : z.string().min(1, { message: "This field is required" }),
    address_title:z.string().nullable(),
    copy_right:z.string().nullable(),
    site_logo:z.string().nullable(),
    govt_logo:z.string().nullable(),
    meta_description:z.string().nullable(),
    keywords:z.string().nullable(),
    address_1:z.string().nullable(),
    address_2:z.string().nullable(),
    map_source:z.string().nullable(),
});
