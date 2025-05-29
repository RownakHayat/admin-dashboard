import { z } from "zod"

export const loginFormSchema = z.object({
    mobile: z.string().min(1, { message: "This field is required" }),
    password: z.string().min(1, { message: "This field is required" })
})