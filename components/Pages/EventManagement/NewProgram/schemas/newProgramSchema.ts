import { z } from "zod";

// const stringToNumber = z.preprocess(
//   (value) => {
//     if (typeof value === "string") {
//       if (value.trim() === "") return null;
//       return parseFloat(value);
//     }
//     return value;
//   },
//   z
//     .number()
//     .nullable()
//     .refine((val) => val === null || !isNaN(val), {
//       message: "Must be a valid number",
//     })
// );




const stringToNumber = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      if (value.trim() === "") return null;
      return parseFloat(value);
    }
    return value;
  },
  z
    .number()
    .nullable()
    .refine((val) => val === null || (val >= 0 && !isNaN(val)), {
      message: "Must be a non-negative number",
    })
);



export const NewProgramSchema = z.object({
  name_en: z.string().min(1, { message: "Program Name is required" }),
  wing_id: z.string().min(1, { message: "Wing is required" }),
  financial_year_id: z
    .string()
    .min(1, { message: "The financial year is required" }),
  total_amount: z.string().min(1, { message: "The Total Amount is required" }),
  // target_of_event : z.string().optional().nullable(),
  target_of_event :z.string().min(1, { message: "Target of Event is required" }),
  budget_items: z
    .array(
      z.object({
        item_id: z.string().nullable(),
        unit_id: z.string().nullable(),
        no_of_unit: stringToNumber,
        unit_cost: stringToNumber,
        total_cost: stringToNumber,
      })
    )
    .optional(),

    program_attachments: z.array(
        z.object({
            attachment_name: z.string().optional().nullable(),
            attachment: z.string().optional().nullable(),
        })
    ).optional(),
});
