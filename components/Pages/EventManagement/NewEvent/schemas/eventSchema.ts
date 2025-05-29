import { z } from "zod";

const stringToNumber = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value.trim() === "") return null;
    return parseFloat(value);
  }
  return value;
}, z.number().nullable());
const eventAttachmentSchema = z.object({
  attachment_name: z.string().optional().nullable(),
  attachment: z.string().optional().nullable(),
  priority: z.number().optional().nullable(),
});

export const eventSchema = z
  .object({
    program_id: z.string().min(1, { message: "This field is required" }),
    // industrial_sector_ids: z.array(z.string()).min(1, { message: "This field is required" }),
    industrial_sector_ids: z.array(z.string()).nullable(),
    cluster_id: z.string().nullable(),
    notification: z.string().nullable().optional(),
    event_name: z.string().min(1, { message: "This field is required" }),
    division_id: z.string().min(1, { message: "This field is required" }),
    district_id: z.string().min(1, { message: "This field is required" }),
    upazila_id: z.string().min(1, { message: "This field is required" }),
    venue: z.string().min(1, { message: "This field is required" }),
    payment_status: z.number().optional().nullable(),
    activity_id: z.string().min(1, { message: "This field is required" }),
    start_date: z.string().min(1, { message: "This field is required" }),
    end_date: z.string().min(1, { message: "This field is required" }),
    dead_line: z.string().min(1, { message: "This field is required" }),
    organizer_id: z.string().nullable(),
    info_type: z.string().nullable(),
    event_carry_forward_id: z.string().nullable(),
    event_entry_fee: stringToNumber.optional(),

    event_attachments: z.array(eventAttachmentSchema).optional(),

    // event_entry_fee: stringToNumber.refine((val) => val !== null && val > 0, { message: "Event entry fee is required and must be a valid decimal number" }),
    remarks: z.string().nullable(),
    is_featured: z.string().default("0"), // New optional field to check if the event is featured
  })
  .superRefine((data, ctx) => {
    if (
      data.payment_status === 2 &&
      (!data.event_entry_fee || data.event_entry_fee <= 0)
    ) {
      ctx.addIssue({
        code: "custom", // Indicate this is a custom validation issue
        path: ["event_entry_fee"],
        message:
          "Event entry fee is required and must be a positive number when payment is enabled",
      });
    }
  });
