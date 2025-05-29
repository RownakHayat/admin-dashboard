import { z } from "zod";

export const chatFormSchema = z.object({
    message: z.string().min(1, { message: "Please type some message" }),
    conversation_attachments: z.array(z.string().nullable(),)
})