import { z } from "zod";

export const baseSchema = z.object({
  survey_title: z.string().min(1, { message: "This field is required" }),
  survey_type: z.string().min(1, { message: "This field is required" }),
  district_id:  z.string().optional().nullable(),
  gender_id:  z.string().optional().nullable(),
  cluster_id:  z.string().optional().nullable(),
  industry_id:  z.string().optional().nullable(),
  direct_beneficiaries:  z.string().optional().nullable(),
  program_id: z.string().optional().nullable(),
  event_detail_id: z.string().optional().nullable(),
  activity_id: z.string().optional().nullable(),
  start_date: z.string().min(1, { message: "This field is required" }),
  end_date: z.string().min(1, { message: "This field is required" }),
  question_type_option1: z
    .array(
      z.object({
        survey_ques_opt_title1: z.string().optional().nullable(),
        survey_ques_opt_seq1: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  question_field: z
    .array(
      z.object({
        question_sl_no: z.string().nullable(),
        question_type_id: z.string().nullable(),
        survey_ques_title: z.string().nullable(),
        ans_type: z.string().nullable(),
        is_ques_required: z.boolean().default(false),
        question_type_option: z
          .array(
            z.object({
              survey_ques_opt_title: z.string().nullable(),
              survey_ques_opt_seq: z.string().nullable(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

const districtSchema = baseSchema.extend({
  district_id: z.string().min(1, { message: "District is required" }),
});

const genderSchema = baseSchema.extend({
  gender_id: z.string().min(1, { message: "Gender is required" }),
});

const clusterSchema = baseSchema.extend({
  cluster_id: z.string().min(1, { message: "Cluster is required" }),
});

const industrySchema = baseSchema.extend({
  industry_id: z.string().min(1, { message: "Industry is required" }),
});

const beneficiarySchema = baseSchema.extend({
  activity_id: z.string().min(1, { message: "Activity Category is required" }),
});

const createSchema = baseSchema;

export { createSchema, districtSchema, genderSchema,clusterSchema,industrySchema,beneficiarySchema };