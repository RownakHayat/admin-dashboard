import { z } from "zod";

export const PaymentSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  event_name: z.string().nullable(),
  created_at: z.string().nullable(),
  activity: z.string().nullable(),
  program: z.string().nullable(),
});

export const ApplyPaymentSchema = z.object({
  // transaction_id:z.string().optional().nullable(),
  transaction_id: z.string().min(1, "Transaction ID is required"),
  remarks: z.string().optional().nullable(),
  attachment: z.string().nullable()
});
export const RejectPaymentSchema = z.object({
  remarks: z.string().optional().nullable(),
});

export const PaymentBkashSchema = z.object({
  financial_year_id: z.string().optional().nullable(),
  program_detail_id: z.string().optional().nullable(),
  event_detail_id: z.string().optional().nullable(),
  activity_id: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  total_payable: z.string().optional().nullable(),
});

export const AppliedPaymentConfirmSchema = z.object({
  event_name: z.string().nullable(),
  activity_type: z.string().nullable(),
  user_id: z.string().nullable(),
  mobile_number: z.string().nullable(),
  amount: z.string().nullable(),
  date: z.string().nullable(),
});
