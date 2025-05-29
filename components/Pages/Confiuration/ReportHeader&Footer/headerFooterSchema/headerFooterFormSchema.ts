import { z } from "zod";

export const headerFooterFormSchema = z.object({
    header: z.string().nullable(),
    footer: z.string().nullable()
});
