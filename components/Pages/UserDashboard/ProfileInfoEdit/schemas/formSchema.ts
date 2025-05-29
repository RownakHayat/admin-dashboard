import { z } from "zod";

export const formSchema = z.object({
  // first tab *******************************************************
  profile_image_path: z.string().optional().nullable(),
  name: z.string().min(1, { message: "This field is required" }),
  name_bn: z.string().optional().nullable(),
  organization_name: z.string().optional().nullable(),
  organization_name_bn: z.string().optional().nullable(),
  father_name: z.string().optional().nullable(),
  mother_name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  spouse_name: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  trade_license_no: z.string().optional().nullable(),
  issue_date: z.string().optional().nullable(),
  nid: z.string().optional().nullable(),
  educational_qualification_id: z.string().optional().nullable(),
  gender_id: z.string().min(1, { message: "This field is required" }),
  date_of_birth: z.string().optional().nullable(),
  signature_image_path: z.string().optional().nullable(),
  sme_category_id: z.string().optional().nullable(),
  interested_division_fair_id: z.string().optional().nullable(),
  business_sector_id: z.string().optional().nullable(),

  // second tab*********************************************************
  office_address: z.string().optional().nullable(),
  factory_address: z.string().optional().nullable(),
  service_type_id: z.string().optional().nullable(),
  organization_type_id: z.string().optional().nullable(),
  permanent_address: z.string().optional().nullable(),
  present_address: z.string().optional().nullable(),
  division_id: z.string().optional().nullable(),
  district_id: z.string().optional().nullable(),
  upazila_id: z.string().optional().nullable(),
  cluster_id: z.string().optional().nullable(),
  year_of_establishment: z.string().optional().nullable(),
  user_manufactured_goods: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  occupation_id: z.string().optional().nullable(),

  // third tab ********************************************************

  business_documents: z
    .array(
      z.object({
        document_id: z.number(),
        attachment: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  user_exported_products: z
    .array(
      z.object({
        year: z.string().optional().nullable(),
        export_amount: z.string().optional().nullable(),
        attachment: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable()
    .refine(
      (products) => {
        // Accessing the parent context
        const { isExported } = products as any; // Explicit type assertion

        // If isExported is true, validate that each product has export_amount and attachment
        if (isExported) {
          return (
            products?.every((item) => item.export_amount && item.attachment) ??
            false
          );
        }

        return true; // If not exported, skip validation
      },
      {
        message:
          "All exported products must have an amount and an attachment when 'Yes' is selected.",
      }
    ),

  user_attachments: z
    .array(
      z.object({
        attachment_name: z.string().optional().nullable(),
        attachment: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
  fair_displayed_products: z.string().optional().nullable(),
  // fourth tab *******************************************************

  ownership_type: z.string().optional().nullable(),
  ownership_place: z.string().optional().nullable(),
  raw_material_source: z.string().optional().nullable(),

  trade_association_name: z.string().optional().nullable(),
  trade_association_name_bn: z.string().optional().nullable(),
  previous_award_name: z.string().optional().nullable(),

  user_profit_losses: z.array(
    z.object({
      financial_year_id: z.string().optional().nullable(),
      yearly_total_sales: z.string().optional().nullable(),
      yearly_total_cost: z.string().optional().nullable(),
      yearly_net_profit: z.string().optional().nullable(),
      bank_loan: z.string().optional().nullable(),
      vat_paid: z.string().optional().nullable(),
      income_tax_paid: z.string().optional().nullable(),
    })
  ),
  defaulter_status: z.string().optional().nullable(),
  export_status: z.string().optional().nullable(),
  loan_bank_name: z.string().optional().nullable(),
  product_consumers: z.string().optional().nullable(),

  business_harmful_document_path: z.string().optional().nullable(),
  business_harmful_description: z.string().optional().nullable(),
  organization_policy: z.string().optional().nullable(),
  organization_facilities: z.string().optional().nullable(),
  why_successful_sme: z.string().optional().nullable(),
  faced_obstacles: z.string().optional().nullable(),
  your_contribution: z.string().optional().nullable(),
  taken_initiatives: z.string().optional().nullable(),
  account_management_system: z.string().optional().nullable(),
  marketing_srategy: z.string().optional().nullable(),
  innovation_technology: z.string().optional().nullable(),
  service_center_environment: z.string().optional().nullable(),

  building_price: z.union([z.string(), z.number()]).optional(),
  business_harmful_status: z.union([z.string(), z.number()]).optional(),
  current_assets: z.union([z.string(), z.number()]).optional(),
  current_capital: z.union([z.string(), z.number()]).optional(),
  current_income_tax_return_status: z
    .union([z.string(), z.number()])
    .optional(),
  factory_mechineries_price: z.union([z.string(), z.number()]).optional(),
  fixed_assets_with_infrastructure: z
    .union([z.string(), z.number()])
    .optional(),
  fixed_assets_without_infrastructure: z
    .union([z.string(), z.number()])
    .optional(),
  land_price: z.union([z.string(), z.number()]).optional(),
  loan_amount: z.union([z.string(), z.number()]).optional(),
  loan_status: z.union([z.string(), z.number()]).optional(),
  monthly_installment: z.union([z.string(), z.number()]).optional(),
  monthly_total_cost: z.union([z.string(), z.number()]).optional(),
  monthly_total_sales: z.union([z.string(), z.number()]).optional(),
  permanent_female_workers: z.union([z.string(), z.number()]).optional(),
  permanent_male_workers: z.union([z.string(), z.number()]).optional(),
  permanent_third_gender_workers: z.union([z.string(), z.number()]).optional(),
  previous_award_status: z.union([z.string(), z.number()]).optional(),
  stock_product_price: z.union([z.string(), z.number()]).optional(),
  temporary_female_workers: z.union([z.string(), z.number()]).optional(),
  temporary_male_workers: z.union([z.string(), z.number()]).optional(),
  temporary_third_gender_workers: z.union([z.string(), z.number()]).optional(),
  total_investment: z.union([z.string(), z.number()]).optional(),
  trade_association_status: z.union([z.string(), z.number()]).optional(),
});
