"use client";
import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import { FormAutoCompleteOnChange } from "@/components/common/Form/FormAutoCompleteOnChange";
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormImageUpload from "@/components/common/Form/FormImageUpload";
import FormImageUploadWithShortText from "@/components/common/Form/FormImageUploadWithShortText";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import {
  ownershipSpace,
  ownershipTypes,
  rawMaterials,
} from "@/components/common/staticData/staticdata";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { useGetAllServiceTypeListQuery } from "@/store/features/configuration/businessType";
import { useGetAllClusterQuery } from "@/store/features/configuration/cluster";
import { useDivisionWiseDistrictQuery } from "@/store/features/configuration/district";
import { useGetAllDivisionQuery } from "@/store/features/configuration/division";
import { useGetAllDocumentQuery } from "@/store/features/configuration/document";
import { useBusinessIndustrialListQuery } from "@/store/features/configuration/industrialSector";
import { useGetAllOccupationTypeQuery } from "@/store/features/configuration/occupationType";
import { useGetAllOrganizationTypeListQuery } from "@/store/features/configuration/organizationType";
import { useGetAllSmeCategoryQuery } from "@/store/features/configuration/smeCategory";
import {
  useDisplayStallTypeQuery,
  useGetAllStallTypeQuery,
} from "@/store/features/configuration/stallType";
import { useDistrictWiseUpazilaQuery } from "@/store/features/configuration/upazila";
import { useGetAllFinancialYearQuery } from "@/store/features/dashboard";
import {
  useGetAllEventListFieldQuery,
  useGetSingleEventDetailsQuery,
  useUpdateEventUserProfileMutation,
} from "@/store/features/eventManagement/newEvent";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import { X } from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z, ZodObject } from "zod";
import {CirclesWithBar} from "react-loader-spinner";

interface Document {
  id: string;
  name: string;
  attachment?: string | File | null;
  isCheckedYes?: boolean;
  isCheckedNo?: boolean;
}

// Define an initial empty schema
type MatchedField = {
  id: string;
  field_value: string;
  default_value?: string;
  field_name: string;
  is_required: number;
};
type DefaultValuesType = Record<string, any>;

const initialSchema = z.object({
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  spouse_name: z.string().optional(),
  nid: z.string().optional(),
  occupation_id: z.string().optional(),
  educational_qualification_id: z.string().optional(),
  signature_image_path: z.string().optional().nullable(),
  profile_image_path: z.string().optional().nullable(),
  sme_category_id: z.string().optional(),
  //====================================== Second Section
  present_address: z.string().optional(),
  permanent_address: z.string().optional(),
  division_id: z.string().optional(),
  district_id: z.string().optional(),
  upazila_id: z.string().optional(),
  cluster_id: z.string().optional(),
  //====================================== Third Section
  trade_association_status: z.number().optional().nullable(),
  business_harmful_status: z.number().optional().nullable(),
  organization_type_id: z.string().optional().nullable(),
  previous_award_name: z.string().optional().nullable(),
  service_type_id: z.string().optional().nullable(),
  business_sector_id: z.string().optional().nullable(),
  office_address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  organization_name: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  factory_address: z.string().optional().nullable(),

  permanent_male_workers: z.string().optional().nullable(),
  permanent_female_workers: z.string().optional().nullable(),
  permanent_third_gender_workers: z.string().optional().nullable(),

  temporary_male_workers: z.string().optional().nullable(),
  temporary_female_workers: z.string().optional().nullable(),
  temporary_third_gender_workers: z.string().optional().nullable(),

  //====================================== fourth Section
  trade_license_no: z.string().optional().nullable(),
  // trade_association_status: z.union([z.string(), z.number()]).optional(),
  year_of_establishment: z.string().optional().nullable(),
  ownership_type: z.string().optional().nullable(),
  raw_material_source: z.string().optional().nullable(),
  ownership_place: z.string().optional(),
  trade_association_name: z.string().optional().nullable(),
  trade_association_name_bn: z.string().optional().nullable(),
  interested_division_fair_id: z.string().optional().nullable(),
  current_income_tax_return_status: z.string().optional().nullable(),
  fixed_assets_with_infrastructure: z
    .union([z.string(), z.number()])
    .optional(),
  fixed_assets_without_infrastructure: z
    .union([z.string(), z.number()])
    .optional(),
  current_assets: z.union([z.string(), z.number()]).optional(),
  land_price: z.union([z.string(), z.number()]).optional(),
  building_price: z.union([z.string(), z.number()]).optional(),
  factory_mechineries_price: z.union([z.string(), z.number()]).optional(),
  stock_product_price: z.union([z.string(), z.number()]).optional(),
  current_capital: z.union([z.string(), z.number()]).optional(),
  otal_investment: z.union([z.string(), z.number()]).optional(),

  service_center_environment: z.string().optional().nullable(),
  account_management_system: z.string().optional().nullable(),
  faced_obstacles: z.string().optional().nullable(),
  why_successful_sme: z.string().optional().nullable(),
  taken_initiatives: z.string().optional().nullable(),
  innovation_technology: z.string().optional().nullable(),
  your_contribution: z.string().optional().nullable(),
  marketing_srategy: z.string().optional().nullable(),
  organization_facilities: z.string().optional().nullable(),
  loan_bank_name: z.string().optional().nullable(),
  monthly_installment: z.union([z.string(), z.number()]).optional(),
  loan_amount: z.union([z.string(), z.number()]).optional(),
})


const ApplicationForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;


  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [dynamicSchema, setDynamicSchema] = useState<ZodObject<any>>(initialSchema);
  const [totalFare, setTotalFare] = useState<number | string>("");

  const [defaultValues, setDefaultValues] = useState<DefaultValuesType>({
    total_stall_fee: totalFare,
    user_profit_losses: [],
  });

  const form = useForm();

  // // const form = useForm();
  // const form = useForm({
  //   resolver: zodResolver(dynamicSchema),
  //   defaultValues,
  // });


  const [matchedFields, setMatchedFields] = useState<MatchedField[]>([]);
  const [fare, setFare] = useState<number | string>("");
  const [numberOfFare, setNumberOfFare] = useState<number | string>("");

  const { data: user } = useAuthUserQuery();



  const initialDisplayProducts =
    user && user?.data && user?.data?.fair_displayed_products
      ? user?.data?.fair_displayed_products?.map((item: { display_product: string }) => item?.display_product) : [];

  const [productTexts, setProductTexts] = useState<string[]>(initialDisplayProducts);



  const { data: allOccupation } = useGetAllOccupationTypeQuery();
  const { data: smeCategory } = useGetAllSmeCategoryQuery();
  const { data: allCluster } = useGetAllClusterQuery();
  const { data: divisionList } = useGetAllDivisionQuery();
  const { data: organizationTypeList } = useGetAllOrganizationTypeListQuery();
  const { data: serviceTypeList } = useGetAllServiceTypeListQuery();
  const { data: industryList } = useBusinessIndustrialListQuery();

  const [updateEventUser] = useUpdateEventUserProfileMutation();

  const divisionId = form.watch("division_id");
  const { data: districtList } = useDivisionWiseDistrictQuery({ id: divisionId }, { skip: !divisionId });

  const district_id = form.watch("district_id");
  const { data: upazilaList } = useDistrictWiseUpazilaQuery({ id: district_id }, { skip: !district_id });

  const {
    data: eventDetails,
    isLoading,
    error,
  } = useGetSingleEventDetailsQuery({ id: id }, { skip: !id });


  const { data: getAllEventListField } = useGetAllEventListFieldQuery();
  const [tradeAssociationStatus, setTradeAssociationStatus] = useState<number | null>(
    user?.data?.user_profile?.trade_association_status ? 1 : 0
  );

  const [takenBusinessPurpose, setTakenBusinessPurpose] = useState<number | null>(
    user?.data?.user_profile?.loan_bank_name ? 1 : null
  );



  const [defaultedLoan, setDefaultedLoan] = useState<number | null>(null);



  const [selectedStall, setSelectedStall] = useState<any>(null);
  const {
    data: stallDetails,
    isLoading: isStallLoading,
    error: stallError,
  } = useDisplayStallTypeQuery(selectedStall, { skip: !selectedStall });
  const [exportedAbroad, setExportedAbroad] = useState<number | null>(null);
  const { data: configDocumentData, refetch } = useGetAllDocumentQuery();
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, boolean>>({});
  const { data: financialYearData } = useGetAllFinancialYearQuery();
  const tempFemaleNum = user?.data?.user_profile?.temporary_female_workers || "";
  const [tempFemale, setTempFemale] = useState(tempFemaleNum);
  //   No. Of Permanent Labours / Workers
  const [maleWorkers, setMaleWorkers] = useState<number | string>("");
  const [femaleWorkers, setFemaleWorkers] = useState<number | string>("");
  const [thirdGenderWorkers, setThirdGenderWorkers] = useState<number | string>("");
  const [totalPermanentWorkers, setTotalPermanentWorkers] = useState<number | string>("");

  //   No. Of Temp Labours / Workers
  const [tempMaleWorkers, setTempMaleWorkers] = useState<number | string>("");
  const [tempFemaleWorkers, setTempFemaleWorkers] = useState<number | string>("");
  const [tempThirdGenderWorkers, setTempThirdGenderWorkers] = useState<number | string>("");
  const [totalTempWorkers, setTotalTempWorkers] = useState<number | string>("");
  const { data: stalltype } = useGetAllStallTypeQuery();
  const [businessHarmfulStatus, setBusinessHarmfulStatus] = useState<number | null>(null);
  const [showTextEntrepreneur, setShowTextEntrepreneur] = useState<number | null>(null);
  const [showExportedStatus, setShowExportedStatus] = useState<number | null>(null);

  //========================================== Profit loss




  const defaultUserProfitLosses = {
    financial_year_id: "",
    yearly_total_sales: "",
    yearly_total_cost: "",
    yearly_net_profit: "",
    bank_loan: "",
    vat_paid: "",
    income_tax_paid: "",
  };
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "user_profit_losses",
  });

  const initialManufacturedGoods =
    user && user?.data && user?.data?.user_manufactured_goods
      ? user?.data?.user_manufactured_goods?.map(
        (item: { manufactured_goods: string }) => item?.manufactured_goods
      )
      : [];

  const [texts, setTexts] = useState<string[]>(initialManufacturedGoods);




  const handleRemoveText = (index: number) => {
    const updatedTexts = [...texts];
    updatedTexts.splice(index, 1);
    setTexts(updatedTexts);
  };


  const [incomeText, setIncomeText] = useState<number | null>(null);
  const handleIncomeText = (e: any) => {
    const { name, checked } = e.target;
    if (name === "show" && checked) {
      setIncomeText(1);
    } else if (name === "hide" && checked) {
      setIncomeText(null);
    }
  };

  const [incomeTaxReturnStatus, setIncomeTaxReturnStatus] = useState<number | null>(null);

  const handleCheckboxChangeTex = (e: any) => {
    const { name, checked } = e.target;
    if (name === "current_income_tax_return_status_yes") {
      setIncomeTaxReturnStatus(checked ? 1 : 0);
    } else if (name === "current_income_tax_return_status_no") {
      setIncomeTaxReturnStatus(checked ? 0 : 1);
    }
  };

  useEffect(() => {
    if (user?.data?.user_profit_loss?.length > 0) {
      const userProfitLosses = user.data.user_profit_loss.map((item: any) => ({
        financial_year_id: item.financial_year_id?.toString() || "",
        yearly_total_sales: item.yearly_total_sales?.toString() || "",
        yearly_total_cost: item.yearly_total_cost?.toString() || "",
        yearly_net_profit: item.yearly_net_profit?.toString() || "",
        bank_loan: item.bank_loan?.toString() || "",
        vat_paid: item.vat_paid?.toString() || "",
        income_tax_paid: item.income_tax_paid?.toString() || "",
      }));
      setDefaultValues((prev) => ({
        ...prev,
        user_profit_losses: userProfitLosses,
      }));
      userProfitLosses.forEach((entry: any) => append(entry));
    } else {
      append(defaultUserProfitLosses);
    }
  }, [user, append, isDataLoaded, form]);

  useEffect(() => {
    if (user && user.data && user.data.user_manufactured_goods) {
      setTexts(
        user.data.user_manufactured_goods.map(
          (item: { manufactured_goods: string }) => item.manufactured_goods
        )
      );
    }
    if (user?.data?.user_profile?.fair_displayed_products) {
      const productsArray = JSON.parse(
        user.data?.user_profile?.fair_displayed_products
      );
      setProductTexts(productsArray);
    }
  }, [user]);


  const handleTradeAssociationStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "show") {
      setTradeAssociationStatus(checked ? 1 : 0);
    } else if (name === "hide") {
      setTradeAssociationStatus(checked ? 0 : 1);
    }
  };





  useEffect(() => {
    setTradeAssociationStatus(user?.data?.user_profile?.trade_association_name ? 1 : null);
  }, [user]);

  const handleTakenBusinessPurpose = (e: any) => {
    const { name, checked } = e.target;
    if (name === "showBusinessPurpose_yes") {
      setTakenBusinessPurpose(checked ? 1 : null);
    } else if (name === "showBusinessPurpose_no") {
      setTakenBusinessPurpose(checked ? null : 1);
    }
  };

  useEffect(() => {
    setTakenBusinessPurpose(user?.data?.user_profile?.loan_bank_name ? 1 : null);
  }, [user]);

  const handleInputChange1 =
    (
      setValue: React.Dispatch<React.SetStateAction<number | string>>,
      workerType: string
    ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);

        // Calculate the total using the current input and other updated values
        const total =
          Number(workerType === "male" ? value : maleWorkers) +
          Number(workerType === "female" ? value : femaleWorkers) +
          Number(workerType === "thirdGender" ? value : thirdGenderWorkers);
        setTotalPermanentWorkers(total);
      };

  const handleInputChange =
    (
      setValue: React.Dispatch<React.SetStateAction<number | string>>,
      currentValue: string
    ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);

        // Calculate the total using the current input and other updated values
        const total =
          Number(currentValue === "male" ? value : tempMaleWorkers) +
          Number(currentValue === "female" ? value : tempFemaleWorkers) +
          Number(currentValue === "thirdGender" ? value : tempThirdGenderWorkers);
        setTotalTempWorkers(total);
      };

  // ============================================ Stall Type

  const handleExportedAbrod = (e: any) => {
    const { name, checked } = e.target;
    setExportedAbroad(name === "exportedAbrodShow" && checked ? 1 : 0);
    // if (name === "exportedAbrodShow") {
    //   setExportedAbroad(checked ? 1 : 0);

    // } else if (name === "exportedAbrodHide") {
    //   setExportedAbroad(checked ? 0 : 1);
    // }
  };

  const handleStallSelect = (selectedStall: any) => {
    setSelectedStall(selectedStall);
    if (!selectedStall) {
      setFare("");
      setNumberOfFare("");
      setTotalFare("");
    }
  };

  useEffect(() => {
    if (!isStallLoading && stallDetails && !stallError && selectedStall) {
      const selectedFare = stallDetails?.data?.stall_fare || "";
      setFare(selectedFare);
      calculateTotalFare(selectedFare, numberOfFare);
    } else if (!selectedStall) {
      setFare("");
    }
  }, [stallDetails, isStallLoading, stallError, numberOfFare, selectedStall]);

  useEffect(() => { }, [fare]);

  const handleNumberOfFareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumberOfFare(value);
    calculateTotalFare(fare, value);
  };

  const calculateTotalFare = (
    fareValue: number | string,
    numberOfFareValue: number | string
  ) => {
    const total = Number(fareValue) * Number(numberOfFareValue);

    setTotalFare(total || 0);
  };

  //===========================Document Status

  const handleCheckboxChange = (documentId: string, checked: boolean) => {
    setDocumentStatuses((prevStatuses) => ({
      ...prevStatuses,
      [documentId]: checked,
    }));
  };

  useEffect(() => {
    if (user) {
      const fatherName = user?.data?.user_profile?.father_name || "";
      const motherName = user?.data?.user_profile?.mother_name || "";
      const spouse_name = user?.data?.user_profile?.spouse_name || "";
      const date_of_birth = user?.data?.user_profile?.date_of_birth || "";
      const nid = user?.data?.user_profile?.nid || "";
      const occupation_id = user?.data?.user_profile?.occupation_id?.toString() || "";
      const sme_category_id = user?.data?.user_profile?.sme_category_id?.toString() || "";

      const ownershipPlace = user?.data?.user_profile?.ownership_place?.toString() || "";
      const interestedDivisionFairId = user?.data?.user_profile?.interested_division_fair?.id || "";
      const tradeAssociationName = user?.data?.user_profile?.trade_association_name || "";
      const tradeAssociationNameBn = user?.data?.user_profile?.trade_association_name_bn || "";

      const educational_qualification_id = user?.data?.user_profile?.educational_qualification_id?.toString() || "";
      const profile_image_path = user?.data?.user_profile?.profile_image_path
        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.profile_image_path
        }` : "";

      const signature_image_path = user?.data?.user_profile?.signature_image_path
        ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.signature_image_path
        }` : "";

      form.setValue("ownership_place", ownershipPlace);
      form.setValue("interested_division_fair_id", interestedDivisionFairId);
      form.setValue("father_name", fatherName);
      form.setValue("mother_name", motherName);
      form.setValue("spouse_name", spouse_name);
      form.setValue("trade_association_name", tradeAssociationName);
      form.setValue("trade_association_name_bn", tradeAssociationNameBn);
      form.setValue("date_of_birth", date_of_birth);
      form.setValue("nid", nid);
      form.setValue("occupation_id", occupation_id);
      form.setValue("sme_category_id", sme_category_id);
      form.setValue("educational_qualification_id", educational_qualification_id);
      form.setValue("signature_image_path", signature_image_path);
      form.setValue("profile_image_path", profile_image_path);
      //================================================================================ Second Section
      const present_address = user?.data?.user_profile?.present_address || "";
      const permanent_address = user?.data?.user_profile?.permanent_address || "";
      const division_id = user?.data?.user_profile?.division_id?.toString() || "";
      const district_id = user?.data?.user_profile?.district_id?.toString() || "";
      const upazila_id = user?.data?.user_profile?.upazila_id?.toString() || "";
      const cluster_id = user?.data?.user_profile?.cluster_id?.toString() || "";
      form.setValue("present_address", present_address);
      form.setValue("permanent_address", permanent_address);
      form.setValue("division_id", division_id);
      form.setValue("district_id", district_id);
      form.setValue("upazila_id", upazila_id);
      form.setValue("cluster_id", cluster_id);
      //================================================================================== Third Section
      const organization_type_id = user?.data?.user_profile?.organization_type_id?.toString() || "";
      const service_type_id = user?.data?.user_profile?.service_type_id?.toString() || "";
      const business_sector_id = user?.data?.user_profile?.business_sector_id?.toString() || "";
      const office_address = user?.data?.user_profile?.office_address || "";
      const website = user?.data?.user_profile?.website || "";
      const organization_name = user?.data?.user_profile?.organization_name || "";
      const telephone = user?.data?.user_profile?.telephone || "";
      const factory_address = user?.data?.user_profile?.factory_address || "";

      form.setValue("organization_type_id", organization_type_id);
      form.setValue("service_type_id", service_type_id);
      form.setValue("business_sector_id", business_sector_id);
      form.setValue("office_address", office_address);
      form.setValue("website", website);
      form.setValue("organization_name", organization_name);
      form.setValue("telephone", telephone);
      form.setValue("factory_address", factory_address);
      //================================================================================ Fourth Section
      const trade_license_no = user?.data?.user_profile?.trade_license_no || "";
      const year_of_establishment = user?.data?.user_profile?.year_of_establishment || "";
      const current_assets = user?.data?.user_profile?.current_assets || "";
      const ownership_type = user?.data?.user_profile?.ownership_type?.toString() || "";
      const fixed_assets_with_infrastructure = user?.data?.user_profile?.fixed_assets_with_infrastructure || "";
      const fixed_assets_without_infrastructure = user?.data?.user_profile?.fixed_assets_without_infrastructure || "";
      // const land_price = user?.data?.user_profile?.land_price || "";
      const land_price = user?.data?.user_profile?.land_price === 0 ? "" : user?.data?.user_profile?.land_price;
      const building_price = user?.data?.user_profile?.building_price === 0 ? "" : user?.data?.user_profile?.building_price;
      const factory_mechineries_price = user?.data?.user_profile?.factory_mechineries_price === 0 ? "" : user?.data?.user_profile?.factory_mechineries_price;
      const stock_product_price = user?.data?.user_profile?.stock_product_price === 0 ? "" : user?.data?.user_profile?.stock_product_price;
      const current_capital = user?.data?.user_profile?.current_capital === 0 ? "" : user?.data?.user_profile?.current_capital;
      const total_investment = user?.data?.user_profile?.total_investment === 0 ? "" : user?.data?.user_profile?.total_investment;
      const current_income_tax_return_status = user?.data?.user_profile?.current_income_tax_return_status === 0 ? "" : user?.data?.user_profile?.current_income_tax_return_status;

      const service_center_environment = user?.data?.user_profile?.service_center_environment || "";
      const account_management_system = user?.data?.user_profile?.account_management_system || "";
      const why_successful_sme = user?.data?.user_profile?.why_successful_sme || "";
      const taken_initiatives = user?.data?.user_profile?.taken_initiatives || "";
      const innovation_technology = user?.data?.user_profile?.innovation_technology || "";
      const your_contribution = user?.data?.user_profile?.your_contribution || "";
      const marketing_srategy = user?.data?.user_profile?.marketing_srategy || "";
      const organization_facilities = user?.data?.user_profile?.organization_facilities || "";

      const permanentMaleWorkers = user?.data?.user_profile?.permanent_male_workers?.toString() || "";
      const permanentFemaleWorkers = user?.data?.user_profile?.permanent_female_workers?.toString() || "";
      const permanentThirdGenderWorkers = user?.data?.user_profile?.permanent_third_gender_workers?.toString() || "";

      const temporaryMaleWorkers = user?.data?.user_profile?.temporary_male_workers?.toString() || "";
      const temporaryFemaleWorkers = user?.data?.user_profile?.temporary_female_workers?.toString() || "";
      const temporaryThirdGenderWorkers = user?.data?.user_profile?.temporary_third_gender_workers?.toString() || "";

      const loanBankName = user?.data?.user_profile?.loan_bank_name || "";
      const monthlyInstallment = user?.data?.user_profile?.monthly_installment || "";
      const loanAmount = user?.data?.user_profile?.loan_amount || "";

      form.setValue("loan_bank_name", loanBankName);
      form.setValue("monthly_installment", monthlyInstallment);
      form.setValue("loan_amount", loanAmount);

      form.setValue("trade_license_no", trade_license_no);
      form.setValue("year_of_establishment", year_of_establishment);
      form.setValue("ownership_type", ownership_type);
      form.setValue("current_assets", current_assets);
      form.setValue("fixed_assets_with_infrastructure", fixed_assets_with_infrastructure);
      form.setValue("fixed_assets_without_infrastructure", fixed_assets_without_infrastructure);
      form.setValue("land_price", land_price);
      form.setValue("building_price", building_price);
      form.setValue("factory_mechineries_price", factory_mechineries_price);
      form.setValue("stock_product_price", stock_product_price);
      form.setValue("current_capital", current_capital);
      form.setValue("marketing_srategy", marketing_srategy);
      form.setValue(
        "current_income_tax_return_status",
        current_income_tax_return_status
      );
      form.setValue("organization_facilities", organization_facilities);

      form.setValue("service_center_environment", service_center_environment);
      form.setValue("account_management_system", account_management_system);
      form.setValue("why_successful_sme", why_successful_sme);
      form.setValue("why_successful_sme", why_successful_sme);
      form.setValue("taken_initiatives", taken_initiatives);
      form.setValue("innovation_technology", innovation_technology);
      form.setValue("your_contribution", your_contribution);
      form.setValue("total_investment", total_investment);
      form.setValue("permanent_male_workers", permanentMaleWorkers);
      form.setValue("permanent_female_workers", permanentFemaleWorkers);
      form.setValue(
        "permanent_third_gender_workers",
        permanentThirdGenderWorkers
      );

      form.setValue("temporary_male_workers", temporaryMaleWorkers);
      form.setValue("temporary_female_workers", temporaryFemaleWorkers);
      form.setValue(
        "temporary_third_gender_workers",
        temporaryThirdGenderWorkers
      );
      form.setValue("total_stall_fee", totalFare);
      form.setValue("total_stall_fee", totalFare);
      form.setValue(
        "current_income_tax_return_status",
        current_income_tax_return_status
      );

      // Trigger validation or re-render if needed
      form.trigger([
        "father_name",
        "mother_name",
        "spouse_name",
        "date_of_birth",
        "nid",
        "permanent_address",
        "permanent_address",
        "signature_image_path",
        "profile_image_path",
        "sme_category_id",
        "educational_qualification_id",
        "occupation_id",
        "trade_association_name",
        "trade_association_name_bn",
        "division_id",
        "district_id",
        "upazila_id",
        "cluster_id",
        "organization_type_id",
        "service_type_id",
        "business_sector_id",
        "office_address",
        "website",
        "organization_name",
        "telephone",
        "factory_address",
        "trade_license_no",
        "year_of_establishment",
        "ownership_type",
        "ownership_place",
        "interested_division_fair_id",
        "fixed_assets_with_infrastructure",
        "fixed_assets_without_infrastructure",
        "current_assets",
        "building_price",
        "land_price",
        "factory_mechineries_price",
        "current_capital",
        "stock_product_price",
        "total_investment",
        "service_center_environment",
        "account_management_system",
        "faced_obstacles",
        "why_successful_sme",
        "taken_initiatives",
        "innovation_technology",
        "your_contribution",
        "marketing_srategy",
        "current_income_tax_return_status",
        "organization_facilities",
        "temporary_male_workers",
        "temporary_female_workers",
        "temporary_third_gender_workers",
        "permanent_male_workers",
        "permanent_female_workers",
        "permanent_third_gender_workers",
        "loan_bank_name",
        "monthly_installment",
        "loan_amount",
        "current_income_tax_return_status",
      ]);
    }
  }, [user, form]);

  useEffect(() => {
    if (!isLoading && eventDetails && getAllEventListField) {
      const eventWiseFields = eventDetails?.data?.event_wise_fields
        ? JSON.parse(eventDetails.data.event_wise_fields)
        : [];


      const eventListFieldsArray = Array.isArray(getAllEventListField?.data)
        ? getAllEventListField?.data
        : [];

      const fields = eventWiseFields
        .map((field: any) => {
          const matchedField = eventListFieldsArray.find(
            (item: any) => item.id === field.id
          );
          return matchedField ? { ...field, ...matchedField } : null;
        })
        .filter(Boolean);

      // Update state with matched fields
      setMatchedFields(fields);

      // Generate dynamic default values and schema
      const newDefaultValues: DefaultValuesType = {};
      const schemaShape: Record<string, any> = {};

      fields.forEach((field: any) => {
         const fieldName = field.field_value || `field_${field.id}`;
        newDefaultValues[fieldName] = field.default_value || "";

        // console.log("Field:", fieldName, "is_required:", field.is_required);
        // console.log("Updated Schema Shape:", schemaShape);

        schemaShape[fieldName] =
          field.is_required === 1
            ? z.string().min(1, "This field is required")
            : z.string().optional().nullable();
        // schemaShape[fieldName] = matchedFields?.map((item:any)=>item?.is_required === 1 ?
        // z.string().min(1, "This field is required") : z.string().optional().nullable())
      });




      // Update state with new values and schema
      setDefaultValues(newDefaultValues);
      setDynamicSchema(z.object(schemaShape));

      if (user?.data?.user_profile?.defaulter_status !== undefined) {
        setDefaultedLoan(user.data.user_profile.defaulter_status);
      }

      // Reset the form with new default values and schema
      form.reset({
        ...defaultValues,
        father_name: user?.data?.user_profile?.father_name || "",
        mother_name: user?.data?.user_profile?.mother_name || "",
        spouse_name: user?.data?.user_profile?.spouse_name || "",
        date_of_birth: user?.data?.user_profile?.date_of_birth || "",
        trade_association_name: user?.data?.user_profile?.trade_association_name || "",
        trade_association_name_bn: user?.data?.user_profile?.trade_association_name_bn || "",
        loan_bank_name: user?.data?.user_profile?.loan_bank_name || "",
        monthly_installment: user?.data?.user_profile?.monthly_installment || "",
        loan_amount: user?.data?.user_profile?.loan_amount || "",
        nid: user?.data?.user_profile?.nid || "",
        occupation_id:
          user?.data?.user_profile?.occupation_id?.toString() || "",
        sme_category_id:
          user?.data?.user_profile?.sme_category_id?.toString() || "",
        educational_qualification_id:
          user?.data?.user_profile?.educational_qualification_id?.toString() ||
          "",
        present_address: user?.data?.user_profile?.present_address || "" || "",

        profile_image_path: user?.data?.user_profile?.profile_image_path
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.profile_image_path
          }`
          : "",

        signature_image_path: user?.data?.user_profile?.signature_image_path
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.signature_image_path
          }`
          : "",
        permanent_address: user?.data?.user_profile?.permanent_address || "",
        division_id: user?.data?.user_profile?.division_id?.toString() || "",
        district_id: user?.data?.user_profile?.district_id?.toString() || "",
        upazila_id: user?.data?.user_profile?.upazila_id?.toString() || "",
        cluster_id: user?.data?.user_profile?.cluster_id?.toString() || "",

        ownership_place: user?.data?.user_profile?.ownership_place?.toString(),
        interested_division_fair_id: user?.data?.user_profile?.interested_division_fair?.id?.toString() || "",

        organization_type_id:
          user?.data?.user_profile?.organization_type_id?.toString() || "",
        office_address: user?.data?.user_profile?.office_address || "",
        website: user?.data?.user_profile?.website || "",
        organization_name: user?.data?.user_profile?.organization_name || "",
        telephone: user?.data?.user_profile?.telephone || "",
        factory_address: user?.data?.user_profile?.factory_address || "",
        service_type_id:
          user?.data?.user_profile?.service_type_id?.toString() || "",
        business_sector_id:
          user?.data?.user_profile?.business_sector_id?.toString() || "",

        trade_license_no: user?.data?.user_profile?.trade_license_no || "",
        fixed_assets_with_infrastructure:
          user?.data?.user_profile?.fixed_assets_with_infrastructure || "",
        fixed_assets_without_infrastructure:
          user?.data?.user_profile?.fixed_assets_without_infrastructure || "",
        year_of_establishment:
          user?.data?.user_profile?.year_of_establishment || "",
        current_assets: user?.data?.user_profile?.current_assets || "",
        ownership_type:
          user?.data?.user_profile?.ownership_type?.toString() || "",

        land_price: user?.data?.user_profile?.land_price === 0 ? "" : user?.data?.user_profile?.land_price?.toString() || "",
        building_price: user?.data?.user_profile?.building_price === 0 ? "" : user?.data?.user_profile?.building_price?.toString() || "",
        factory_mechineries_price: user?.data?.user_profile?.factory_mechineries_price === 0 ? "" : user?.data?.user_profile?.factory_mechineries_price?.toString() || "",
        stock_product_price: user?.data?.user_profile?.stock_product_price === 0 ? "" : user?.data?.user_profile?.stock_product_price?.toString() || "",
        current_capital: user?.data?.user_profile?.current_capital === 0 ? "" : user?.data?.user_profile?.current_capital?.toString() || "",
        total_investment: user?.data?.user_profile?.total_investment === 0 ? "" : user?.data?.user_profile?.total_investment?.toString() || "",
        current_income_tax_return_status: user?.data?.user_profile?.current_income_tax_return_status === 0 ? "" : user?.data?.user_profile?.current_income_tax_return_status?.toString() || "",

        service_center_environment: user?.data?.user_profile?.service_center_environment?.toString() || "",
        account_management_system: user?.data?.user_profile?.account_management_system?.toString() || "",
        faced_obstacles:
          user?.data?.user_profile?.faced_obstacles?.toString() || "",
        why_successful_sme:
          user?.data?.user_profile?.why_successful_sme?.toString() || "",
        taken_initiatives:
          user?.data?.user_profile?.taken_initiatives?.toString() || "",
        innovation_technology:
          user?.data?.user_profile?.innovation_technology?.toString() || "",
        marketing_srategy:
          user?.data?.user_profile?.marketing_srategy?.toString() || "",
        organization_facilities:
          user?.data?.user_profile?.organization_facilities?.toString() || "",

        permanent_male_workers:
          user.data.user_profile.permanent_male_workers?.toString() || "",
        permanent_female_workers:
          user.data.user_profile.permanent_female_workers?.toString() || "",
        permanent_third_gender_workers:
          user.data.user_profile.permanent_third_gender_workers?.toString() ||
          "",

        temporary_male_workers:
          user.data.user_profile.temporary_male_workers?.toString() || "",
        temporary_female_workers:
          user.data.user_profile.temporary_female_workers?.toString() || "",
        temporary_third_gender_workers: user.data.user_profile.temporary_third_gender_workers?.toString() || "",
      });
      setIncomeTaxReturnStatus(
        user?.data?.user_profile?.current_income_tax_return_status || 0
      );
    }
  }, [eventDetails, getAllEventListField, isLoading]);

  // if (isLoading) return <div>Loading...</div>;
  if (isLoading)
    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
          <CirclesWithBar
              height="100"
              width="100"
              color="#4fa94d"
              outerCircleColor="#4fa94d"
              innerCircleColor="#4fa94d"
              barColor="#4fa94d"
              ariaLabel="circles-with-bar-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
          />
        </div>
    );
  if (error) return <div>Error loading event details</div>;

  const baseURL = siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL || "";



  const handleBusinessHarmfulStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "business_harmful_status_yes") {
      setBusinessHarmfulStatus(checked ? 1 : 0);
    } else if (name === "business_harmful_status_no") {
      setBusinessHarmfulStatus(checked ? 0 : 1);
    }
  };




  const handleCheckboxChangeEntrepreneur = (e: any) => {
    const { name, checked } = e.target;
    if (name === "previous_award_status_yes") {
      setShowTextEntrepreneur(checked ? 1 : null);
    } else if (name === "previous_award_status_no") {
      setShowTextEntrepreneur(checked ? null : 1);
    }
  };

  const handleExportedStatus = (event: any) => {
    if (event.target.name === "export_status_yes") {
      setShowExportedStatus(1); // Yes selected
    } else if (event.target.name === "export_status_no") {
      setShowExportedStatus(null); // No selected
      // Reset user_exported_products when selecting "No"
      form.setValue("user_exported_products", []); // Clear the array of exported products
    }
  };



  const onSubmit = async (data: any) => {
    form.setValue("total_stall_fee", totalFare);
    const values = form.getValues();

    if (showTextEntrepreneur !== 1) {
      values.previous_award_name = "";
    }
    values.previous_award_status =
      values.previous_award_status?.toString() || "";
    if (showExportedStatus === 1) {
      const hasEmptyFields = values.user_exported_products.some((item: any) => {
        return !item.export_amount || !item.attachment;
      });

      if (hasEmptyFields) {
        Swal.fire({
          title: "Error!",
          text: "All exported products must have an amount and an attachment when 'Yes' is selected.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#f44336",
        });
        return; // Prevent submission if validation fails
      }
    }

    values.fair_displayed_products = productTexts;
    const maleWorkers = Number(values.permanent_male_workers) || 0;
    const femaleWorkers = Number(values.permanent_female_workers) || 0;
    const thirdGenderWorkers =
      Number(values.permanent_third_gender_workers) || 0;
    const totalPermanentWorkers =
      maleWorkers + femaleWorkers + thirdGenderWorkers;

    const tempMaleWorkers = Number(values.temporary_male_workers) || 0;
    const tempFemaleWorkers = Number(values.temporary_female_workers) || 0;
    const tempThirdGenderWorkers =
      Number(values.temporary_third_gender_workers) || 0;
    const totalTempWorkers =
      tempMaleWorkers + tempFemaleWorkers + tempThirdGenderWorkers;

    const ProfileImagePath = values?.profile_image_path?.startsWith(baseURL)
      ? values?.profile_image_path?.replace(baseURL, "")
      : values?.profile_image_path ?? "";

    const signatureImagePath = values?.signature_image_path?.startsWith(baseURL)
      ? values?.signature_image_path?.replace(baseURL, "")
      : values?.signature_image_path ?? "";

    const formattedDateOfBirth = values?.date_of_birth
      ? moment(values?.date_of_birth).format("YYYY-MM-DD")
      : ''; // Empty string if no value

    const formattedYearOfEstablishment = values?.year_of_establishment
      ? moment(values?.year_of_establishment).format("YYYY-MM-DD")
      : ''; // Empty string if no value

    const userProfitLosses = values.user_profit_losses;

    const filteredValues = matchedFields.reduce((acc, field) => {
      const fieldName = field.field_value || `field_${field.id}`;
      if (values[fieldName] !== undefined) {
        acc[fieldName] = values[fieldName];
      }
      return acc;
    }, {} as Record<string, any>);

    const formattedData = {
      // permanent_male_workers: maleWorkers,
      ...values,
      permanent_female_workers: femaleWorkers,
      permanent_third_gender_workers: thirdGenderWorkers,
      total_permanent_workers: totalPermanentWorkers,

      // temporary_male_workers: tempMaleWorkers,
      temporary_female_workers: tempFemaleWorkers,
      temporary_third_gender_workers: tempThirdGenderWorkers,
      total_temp_workers: totalTempWorkers,
      totalFare: totalFare,
      profit_loss: userProfitLosses,
      business_harmful_status: businessHarmfulStatus,
      trade_association_status: tradeAssociationStatus,
      previous_award_status: showTextEntrepreneur,
    };

    try {
      const mutationFn = updateEventUser;

      const res = await mutationFn({
        ...filteredValues,
        // ...formattedData,
        // date_of_birth: formattedDateOfBirth,
        // year_of_establishment: formattedYearOfEstablishment,
        event_detail_id: id,
        profile_image_path: ProfileImagePath,
        signature_image_path: signatureImagePath,
        event_fee: eventDetails?.data?.event_entry_fee,
        business_harmful_status: businessHarmfulStatus,
        trade_association_status: tradeAssociationStatus,
        previous_award_status: showTextEntrepreneur,
        current_income_tax_return_status: incomeTaxReturnStatus,
      }).unwrap();
      if (res.code === 200) {
        await form.reset();
        Swal.fire({
          title: "Success!",
          text: "Participated at Event Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/events/new-event-apply");
        });
      }
    } catch (err: any) {
      err?.data?.errors.forEach((error: any) => {
        form.setError(error.field, {
          type: "server",
          message: error.message,
        });
      })
    }
  };
  // <pre>{JSON.stringify(viewData, null, 2)}</pre>

  const currentYear = new Date().getFullYear();
  const lastThreeYears = [currentYear, currentYear - 1, currentYear - 2];
  const defaultExportedProducts = lastThreeYears.map((year) => ({
    year: year.toString(),
    export_amount: "",
    attachment: "",
  }));

  const handleDefaultedLoan = (e: any) => {
    const { name, checked } = e.target;
    if (name === "defaulted_status_yes") {
      setDefaultedLoan(checked ? 1 : null);
    } else if (name === "defaulted_status_no") {
      setDefaultedLoan(checked ? null : 1);
    }
  };


  const handleProductRemoveText = (index: number) => {
    setProductTexts((prevProductTexts) =>
      prevProductTexts.filter((_, i) => i !== index)
    );
  };

  const handleAddTextProduct = () => {
    const inputValue = form.getValues("fair_displayed_products");

    if (inputValue) {
      setProductTexts((prevProducts) => {
        const updatedProducts = [...(prevProducts || []), inputValue]; // Ensure prevProducts is an array
        form.setValue("fair_displayed_products", updatedProducts.join(", "));
        return updatedProducts;
      });
      setTimeout(() => {
        form.setValue("fair_displayed_products", "");
      }, 0);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>
  }



  return (
    <div className="w-full bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-center items-center">
            <div className="">
              <h1 className="text-lg font-bold text-md flex justify-center">ক্ষুদ্র ও মাঝারি শিল্প ফাউন্ডেশন</h1>
              <p className="font-bold text-md flex justify-center">শিল্প মন্ত্রণালয়</p>
              <p className="underline text-sm flex justify-center"> <span>পর্যটন ভবন, ই/৫-সি/১ আগারগাঁও প্রশাসনিক এলাকা, শের-ই-বাংলা নগর, ঢাকা-১২০৭ </span> </p>
              <h1 className="flex justify-center font-bold">{eventDetails?.data?.event_name}</h1>
              <p className="flex justify-center">
                {/* {`${moment(
                  eventDetails?.data?.start_date || ""
                ).format('DD MMM YYYY')}`} */}
                {`${moment(
                  eventDetails?.data?.start_date || ""
                ).format('DD MMM YYYY')}`}&nbsp;-&nbsp;{`${moment(
                  eventDetails?.data?.end_date || ""
                ).format('DD MMM YYYY')}`}</p>
              <p className="flex justify-center">{eventDetails?.data?.venue}</p>
            </div>
          </div>
        </CardHeader>
        {/* <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Program name</p>
                <p className="text-[#545454]">
                  {eventDetails?.data?.program_info?.name_en}
                </p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Event name</p>
                <p className="text-[#545454]">
                  {eventDetails?.data?.event_name}
                </p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Industrial Sector</p>
                <p className="text-[#545454]">
                  {eventDetails?.data?.industrial_sec_for_events?.map(
                    (item: any) => item?.business_sector?.name
                  )}
                </p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Deadline</p>
                <p className="text-[#545454]">
                  {`${moment(eventDetails?.data?.dead_line || "").format(
                    "DD MMM YYYY"
                  )}`}
                </p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Start Date</p>
                <p className="text-[#545454]">{`${moment(
                  eventDetails?.data?.start_date || ""
                ).format("DD MMM YYYY")}`}</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">End Date</p>
                <p className="text-[#545454]">{`${moment(
                  eventDetails?.data?.end_date || ""
                ).format("DD MMM YYYY")}`}</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Activity Type</p>
                <p className="text-[#545454]">
                  {eventDetails?.data?.activity?.name}
                </p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4">
              <div className="">
                <p className="text-[#BDBEC0]">Total Event Fee</p>
                <p className="text-[#545454]">
                  {eventDetails?.data?.event_entry_fee}
                </p>
              </div>
            </div>
          </div>
        </CardContent> */}
      </Card>
      <div className="mx-2 mt-5">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            {Object.keys(defaultValues).map((fieldName: any, index: any) => {
              const matchedField = matchedFields?.find(
                (field: MatchedField) => field.field_value === fieldName
              );
              const isRequired = matchedField?.is_required === 1;
              // const fieldID = matchedField?.id;
              const fieldID = matchedField?.id || `${fieldName}-${index}`;
              const fieldNameValue =
                matchedField?.field_name || "Unknown Field Name";

              return (
                <div key={fieldID} className="col-span-12 md:col-span-6">
                  <div>
                    {/* { JSON.stringify(fieldName, null, 2) } */}
                    {fieldName === "father_name" ? (
                      <FormInput
                        name="father_name"
                        label={fieldNameValue}
                        remark={isRequired}
                      />
                    ) : fieldName === "date_of_birth" ||
                      fieldName === "year_of_establishment" ? (
                      <FormDatePicker
                        name={fieldName}
                        label={fieldNameValue}
                        remark={isRequired}
                      />
                    ) : fieldName === "service_type_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          serviceTypeList?.data,
                          "service",
                          "name"
                        )}
                        singleListName="service"
                        label={fieldNameValue}
                        placeholder="Business Type"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "business_sector_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          industryList?.data,
                          "name",
                          "name"
                        )}
                        singleListName="name"
                        label={fieldNameValue}
                        placeholder="Select Industry"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "occupation_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          allOccupation?.data,
                          "occupation",
                          "name"
                        )}
                        singleListName="occupation"
                        label={fieldNameValue}
                        placeholder="Occupation"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "cluster_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          allCluster?.data,
                          "cluster",
                          "name"
                        )}
                        singleListName="cluster"
                        label={fieldNameValue}
                        placeholder="Cluster"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "division_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          divisionList?.data,
                          "division",
                          "name"
                        )}
                        singleListName="division"
                        label={fieldNameValue}
                        placeholder="Select division"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "interested_division_fair_id" ? (
                      <FormAutoComplete
                        name="interested_division_fair_id"
                        data={listArrayDaynamicModify(
                          divisionList?.data,
                          "division",
                          "name"
                        )}
                        singleListName="division"
                        label="Interested Division Fair"
                        placeholder="Select division"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "district_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          districtList?.data,
                          "district",
                          "name"
                        )}
                        singleListName="district"
                        label={fieldNameValue}
                        placeholder="Select District"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "upazila_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          upazilaList?.data,
                          "upazila",
                          "name"
                        )}
                        singleListName="upazila"
                        label={fieldNameValue}
                        placeholder="Select upazila"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "sme_category_id" ? (
                      <FormAutoComplete
                        name={fieldName}
                        data={listArrayDaynamicModify(
                          smeCategory?.data,
                          "sme",
                          "name"
                        )}
                        singleListName="sme"
                        label={fieldNameValue}
                        placeholder="Select sme"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "ownership_type" ? (
                      <FormAutoComplete
                        name="ownership_type"
                        data={listArrayDaynamicModify(
                          ownershipTypes,
                          "ownership",
                          "name"
                        )}
                        singleListName="ownership"
                        label="Type Of Ownership"
                        placeholder="Select"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "ownership_place" ? (
                      <FormAutoComplete
                        name="ownership_place"
                        data={listArrayDaynamicModify(
                          ownershipSpace,
                          "ownershipPlace",
                          "name"
                        )}
                        singleListName="ownershipPlace"
                        label="Ownership of Space"
                        placeholder="Select"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "raw_material_source" ? (
                      <FormAutoComplete
                        name="raw_material_source"
                        data={listArrayDaynamicModify(
                          rawMaterials,
                          "material",
                          "name"
                        )}
                        singleListName="material"
                        label="Source Of Essential Raw Materials"
                        placeholder="Select"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "telephone" ? (
                      <FormInput
                        name="telephone"
                        label={fieldNameValue}
                        remark={isRequired}
                        type="number"
                      />
                    ) : fieldName === "office_address" ? (
                      <FormInput
                        name="office_address"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "factory_address" ? (
                      <FormInput
                        name="factory_address"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "website" ? (
                      <FormInput
                        name="website"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "trade_license_no" ? (
                      <FormInput
                        name="trade_license_no"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "fixed_assets_with_infrastructure" ? (
                      <FormInput
                        name="fixed_assets_with_infrastructure"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "fixed_assets_without_infrastructure" ? (
                      <FormInput
                        name="fixed_assets_without_infrastructure"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "land_price" ? (
                      <FormInput
                        name="land_price"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "building_price" ? (
                      <FormInput
                        name="building_price"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "factory_mechineries_price" ? (
                      <FormInput
                        name="factory_mechineries_price"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "stock_product_price" ? (
                      <FormInput
                        name="stock_product_price"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "monthly_total_sales" ? (
                      <FormInput
                        name="monthly_total_sales"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "total_investment" ? (
                      <FormInput
                        name="total_investment"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "current_capital" ? (
                      <FormInput
                        name="current_capital"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "organization_policy" ? (
                      <FormTextArea
                        name="organization_policy"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "organization_facilities" ? (
                      <FormTextArea
                        name="organization_facilities"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "why_successful_sme" ? (
                      <FormTextArea
                        name="why_successful_sme"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "taken_initiatives" ? (
                      <FormTextArea
                        name="taken_initiatives"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "account_management_system" ? (
                      <FormTextArea
                        name="account_management_system"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "innovation_technology" ? (
                      <FormTextArea
                        name="innovation_technology"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "marketing_srategy" ? (
                      <FormTextArea
                        name="marketing_srategy"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "service_center_environment" ? (
                      <FormTextArea
                        name="service_center_environment"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "current_income_tax_return_status" ? (
                      <>
                        <div className="col-span-12 md:col-span-6 text-[#5B6471]">
                          <p className="text-[#545454]">
                            Have You Filed Your Income Tax Return In The Current
                            Financial Year?{isRequired && <span className="text-red-500 pl-1" > * </span>}
                          </p>
                          {/* current_income_tax_return_status == 1 and 0 pathate hobe*/}
                          <span>
                            <input
                              type="checkbox"
                              name="current_income_tax_return_status_yes"
                              checked={incomeTaxReturnStatus === 1}
                              onChange={handleCheckboxChangeTex}
                            />
                            <span className="ml-2 text-[#545454]">Yes</span>
                          </span>
                          <span className="ml-4">
                            <input
                              type="checkbox"
                              name="current_income_tax_return_status_no"
                              checked={incomeTaxReturnStatus === 0}
                              onChange={handleCheckboxChangeTex}
                            />
                            <span className="ml-2 text-[#545454]">No</span>
                          </span>
                        </div>
                      </>
                    ) : fieldName === "export_status" ? (
                      <>
                        <div className="border border-spacing-2 rounded-lg p-4 mt-4 bg-white">
                          <div>
                            <p className="text-[#545454]">Are The Products Exported Abroad?{isRequired && <span className="text-red-500 pl-1" > * </span>}</p>
                            <span>
                              <input
                                type="checkbox"
                                name="export_status_yes"
                                checked={showExportedStatus === 1}
                                onChange={handleExportedStatus}
                              />
                              <span className="ml-2 text-[#545454]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="export_status_no"
                                checked={showExportedStatus === 0}
                                onChange={handleExportedStatus}
                              />
                              <span className="ml-2 text-[#545454]">No</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-12 items-center ">
                            <div className="col-span-12">
                              {showExportedStatus === 1 && (
                                <>
                                  <p className="text-[14px] text-[#767676] mt-3">
                                    <span className="text-red-500">*</span>
                                    How Much Total Goods/Services Have Been Exported In The Last Three Years? (US Dollars). Affidavits Must Be filed In Support Of The Answer. For Example -Export Proceeds Realization Certificate (PRC){isRequired && <span className="text-red-500 pl-1" > * </span>}
                                  </p>
                                  <div className="grid grid-cols-12 mt-4">
                                    <div className="col-span-12 flex flex-wrap gap-4 items-center justify-center sm:justify-start ">
                                      {/* {lastThreeYears.map((year, index) => {
                                const exportAmount = form.getValues(`user_exported_products.${index}.export_amount`);
                                const attachment = form.getValues(`user_exported_products.${index}.attachment`);
                                const isFieldEmpty = !exportAmount && !attachment;

                                return (
                                  <>
                                    <div key={year} className="">
                                      <div className="flex flex-col items-center justify-between border border-spacing-2 rounded-lg bg-white p-3 mx-2 xl:flex-row xl:gap-2">
                                        <div className="mr-2">
                                          <p className="text-[#545454]">Amount</p>
                                          <Input
                                            type="text"
                                            {...form.register(`user_exported_products.${index}.export_amount`)}
                                            placeholder="Enter Amount"
                                          />
                                        </div>

                                        <div className="">
                                          <FormImageUploadWithShortText
                                            label={year.toString()}
                                            {...form.register(`user_exported_products.${index}.attachment`)}
                                            remark={true}
                                          />
                                        </div>
                                      </div>
                                      {isFieldEmpty && (
                                        <p className="text-red-500 text-sm mt-2">
                                          Please provide both the amount and the attachment for {year}.
                                        </p>
                                      )}
                                    </div>
                                  </>
                                )
                              })} */}
                                      {lastThreeYears.map((year, index) => {
                                        const exportAmount = form.getValues(`user_exported_products.${index}.export_amount`);
                                        const attachment = form.getValues(`user_exported_products.${index}.attachment`);

                                        const isExportAmountEmpty = !exportAmount;
                                        const isAttachmentEmpty = !attachment;

                                        return (
                                          <div key={year}>
                                            <div className="flex flex-col items-center justify-between border border-spacing-2 rounded-lg bg-white p-3 mx-2 xl:flex-row xl:gap-2">
                                              <div className="mr-2">
                                                <p className="text-[#545454]">Amount</p>
                                                <Input
                                                  type="text"
                                                  {...form.register(`user_exported_products.${index}.export_amount`)}
                                                  placeholder="Enter Amount"
                                                />
                                              </div>

                                              <div className="">
                                                <FormImageUploadWithShortText
                                                  label={year.toString()}
                                                  {...form.register(`user_exported_products.${index}.attachment`)}
                                                  remark={true}
                                                />
                                              </div>
                                            </div>

                                            {isExportAmountEmpty && (
                                              <p className="text-red-500 text-sm mt-2">
                                                Please provide both the amount and the attachment for {year}.
                                              </p>
                                            )}
                                            {isAttachmentEmpty && (
                                              <p className="text-red-500 text-sm mt-2"></p>
                                            )}
                                            {isExportAmountEmpty && isAttachmentEmpty && (
                                              <p className="text-red-500 text-sm mt-2"></p>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : fieldName === "current_assets" ? (
                      <FormInput
                        name="current_assets"
                        label={fieldNameValue}
                        type="number"
                        remark={isRequired}
                      />
                    ) : fieldName === "interested_division_fair_id" ? (
                      <FormAutoComplete
                        name="interested_division_fair_id"
                        data={listArrayDaynamicModify(
                          divisionList?.data,
                          "division",
                          "name"
                        )}
                        singleListName="division"
                        label={fieldNameValue}
                        placeholder="Select division"
                        control={form.control}
                        remark={isRequired}
                      />
                    ) : fieldName === "product_consumers" ? (
                      <FormInput
                        name="product_consumers"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "previous_award_status" ? (
                      <>
                        <div className="col-span-12 md:col-span-6 text-[#545454]">
                          <p>Have You Ever Received an Award as an Entrepreneur?{isRequired && <span className="text-red-500 pl-1" > * </span>}</p>
                          {/* previous_award_status */}
                          <span>
                            <input
                              type="checkbox"
                              name="previous_award_status_yes"
                              checked={showTextEntrepreneur === 1}
                              onChange={handleCheckboxChangeEntrepreneur}
                            />
                            <span className="ml-2 text-[#545454]">Yes</span>
                          </span>
                          <span className="ml-4">
                            <input
                              type="checkbox"
                              name="previous_award_status_no"
                              checked={showTextEntrepreneur === null}
                              onChange={handleCheckboxChangeEntrepreneur}
                            />
                            <span className="ml-2 text-[#545454]">No</span>
                          </span>
                        </div>
                        {showTextEntrepreneur && (
                          <div className="col-span-12 md:col-span-6 ">
                            <FormInput
                              // name="previous_award_name"
                              name={fieldName}
                              label="Which Organization To Be And What Award?"
                            />
                          </div>
                        )}
                      </>
                    ) : fieldName === "organization_name" ? (
                      <FormInput
                        name="organization_name"
                        label={fieldNameValue}
                        placeholder=""
                        remark={isRequired}
                      />
                    ) : fieldName === "organization_type_id" ? (
                      <FormAutoComplete
                        name="organization_type_id"
                        data={listArrayDaynamicModify(
                          organizationTypeList?.data,
                          "organization",
                          "name"
                        )}
                        singleListName="organization"
                        label="Organization Type"
                        placeholder=""
                      />
                    ) : fieldName === "fair_displayed_products" ? (
                      <div className="col-span-12 md:col-span-6 items-center">
                        <div className="relative flex items-center gap-4 ">
                          <FormInput
                            name="fair_displayed_products"
                            placeholder=""
                            label="Fair Displayed Products"
                            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-success hover:bg-success text-white rounded-md mt-8"
                            onClick={handleAddTextProduct}
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          {Array.isArray(productTexts) &&
                            productTexts.map((text, index) => (
                              <div key={index} className="badge-container m-2 ">
                                <div className="inline-flex items-center border-2 border-[#2b7d74] text-xs px-2 py-1 rounded-full font-bold">
                                  <span className="mr-1 text-[#2b7d74]">
                                    {text}
                                  </span>
                                  <button type="button" className="ml-1">
                                    <X
                                      className="w-4 h-4 text-[#767676]"
                                      onClick={() =>
                                        handleProductRemoveText(index)
                                      }
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : fieldName === "loan_status" ? (
                      <>
                        <div className="bg-white border border-spacing-2 rounded-lg p-4 my-4">
                          <div className="my-4">
                            <p className="text-[#545454]">
                              Have Taken Any Loan For Business Purpose?{isRequired && <span className="text-red-500 pl-1" > * </span>}
                            </p>
                            {/* loan_status */}
                            <span>
                              <input
                                type="checkbox"
                                name="showBusinessPurpose_yes"
                                checked={takenBusinessPurpose === 1}
                                onChange={handleTakenBusinessPurpose}
                              />
                              <span className="ml-2 text-[#545454]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="showBusinessPurpose_no"
                                checked={takenBusinessPurpose === null}
                                onChange={handleTakenBusinessPurpose}
                              />
                              <span className="ml-2 text-[#545454]">No</span>
                            </span>
                          </div>
                          {takenBusinessPurpose === 1 && (
                            <div className="border border-spacing-2 p-3 rounded-lg">
                              <div className="grid grid-cols-12 items-center gap-4">
                                <div className="col-span-12 md:col-span-6">
                                  <FormInput
                                    name="loan_bank_name"
                                    label="Name Of Bank ? Branch"
                                  />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                  <FormInput
                                    name="loan_amount"
                                    label="Amount Of Loan"
                                    type="number"
                                  />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                  <FormInput
                                    name="monthly_installment"
                                    label="Monthly Installment Amount"
                                    type="number"
                                  />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                  <div className="my-4">
                                    <p className="text-[#545454]">
                                      Have You Ever Defaulted On A Loan?
                                    </p>
                                    <span>
                                      <input
                                        type="radio"
                                        name="defaulted_status"
                                        value="1"
                                        checked={defaultedLoan === 1}
                                        onChange={() => setDefaultedLoan(1)}
                                      />
                                      <span className="ml-2 text-[#545454]">
                                        Yes
                                      </span>
                                    </span>
                                    <span className="ml-4">
                                      <input
                                        type="radio"
                                        name="defaulted_status"
                                        value="0"
                                        checked={defaultedLoan === 0}
                                        onChange={() => setDefaultedLoan(0)}
                                      />
                                      <span className="ml-2 text-[#545454]">
                                        No
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )
                      : fieldName === "trade_association_status" ? (
                        <>
                          <div className="col-span-12 md:col-span-6 ">
                            <p>Affiliated with Associations/Tradebodies?{isRequired && <span className="text-red-500 pl-1" > * </span>}</p>
                            {/* trade_association_status */}
                            <span>
                              <input
                                type="checkbox"
                                name="show"
                                checked={tradeAssociationStatus === 1}
                                onChange={handleTradeAssociationStatus}
                              />
                              <span className="ml-2">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="hide"
                                checked={tradeAssociationStatus === 0}
                                onChange={handleTradeAssociationStatus}
                              />
                              <span className="ml-2">No</span>
                            </span>
                          </div>
                          {tradeAssociationStatus === 1 && (
                            <div className="w-full">
                              <div className="">
                                <FormInput
                                  // name="trade_association_name"
                                  name={fieldName}
                                  label="Name Of Association/Tradebody"
                                />
                              </div>
                              <div className="">
                                <FormInput
                                  name="trade_association_name_bn"
                                  label="Name Of Association/Tradebody (Bangla)"
                                  bengaliAllow={true}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )
                        : fieldName === "signature_image_path" ||
                          fieldName === "profile_image_path" ? (
                          <FormImageUpload
                            name={fieldName}
                            label={fieldNameValue}
                            remark={isRequired}
                          />
                        ) : fieldName === "permanent_male_workers" ? (
                          <>
                            <div>
                              <p className="mb-4 text-[17px] text-[#545454]">
                                No. Of Permanent Labours / Workers{isRequired && <span className="text-red-500 pl-1" > * </span>}
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Male</p>
                                  <Input
                                    type="number"
                                    {...form.register("permanent_male_workers")}
                                  />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Female</p>
                                  <Input
                                    type="number"
                                    {...form.register("permanent_female_workers")}
                                  />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Third Gender</p>
                                  <Input
                                    type="number"
                                    {...form.register(
                                      "permanent_third_gender_workers"
                                    )}
                                  />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Total</p>
                                  <Input
                                    className="bg-gray-100"
                                    value={
                                      Number(
                                        form.watch("permanent_male_workers") || 0
                                      ) +
                                      Number(
                                        form.watch("permanent_female_workers") || 0
                                      ) +
                                      Number(
                                        form.watch(
                                          "permanent_third_gender_workers"
                                        ) || 0
                                      )
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : fieldName === "temporary_male_workers" ? (
                          <>
                            <div>
                              <p className="mb-4 text-[17px] text-[#545454]">
                                Number Of Temporary Labours / Workers{isRequired && <span className="text-red-500 pl-1" > * </span>}
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Male</p>
                                  <Input
                                    type="number"
                                    {...form.register("temporary_male_workers")}
                                  />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Female</p>
                                  <Input
                                    type="number"
                                    {...form.register("temporary_female_workers")}
                                  />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Third Gender</p>
                                  <Input
                                    type="number"
                                    {...form.register(
                                      "temporary_third_gender_workers"
                                    )}
                                  />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                  <p className="text-[#545454]">Total</p>
                                  <Input
                                    className="bg-gray-100"
                                    value={
                                      Number(
                                        form.watch("temporary_male_workers") || 0
                                      ) +
                                      Number(
                                        form.watch("temporary_female_workers") || 0
                                      ) +
                                      Number(
                                        form.watch(
                                          "temporary_third_gender_workers"
                                        ) || 0
                                      )
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )
                          : fieldName === "business_harmful_status" ? (
                            <>

                              <div className="col-span-12 md:col-span-6">
                                <div className="my-4">
                                  <p className="text-[#545454]">
                                    Is The Product/Service Directly Or Indirectly Harmful
                                    to The Environment?{isRequired && <span className="text-red-500 pl-1" > * </span>}
                                  </p>
                                  {/* business_harmful_status */}
                                  <span>
                                    <input
                                      type="checkbox"
                                      name="business_harmful_status_yes"
                                      checked={businessHarmfulStatus === 1}
                                      onChange={handleBusinessHarmfulStatus}
                                    />
                                    <span className="ml-2 text-[#545454]">Yes</span>
                                  </span>
                                  <span className="ml-4">
                                    <input
                                      type="checkbox"
                                      name="business_harmful_status_no"
                                      checked={businessHarmfulStatus === 0}
                                      onChange={handleBusinessHarmfulStatus}
                                    />
                                    <span className="ml-2 text-[#545454]">No</span>
                                  </span>
                                </div>
                              </div>
                            </>
                          )
                            : fieldName === "stall_type_id" ? (
                              <>
                                <FormAutoCompleteOnChange
                                  name={fieldName}
                                  data={listArrayDaynamicModify(
                                    stalltype?.data,
                                    "stall",
                                    "name"
                                  )}
                                  singleListName="stall"
                                  label={fieldNameValue}
                                  placeholder="Select stall"
                                  control={form.control}
                                  remark={isRequired}
                                  onChange={handleStallSelect}
                                />
                                <div className="flex gap-2">
                                  <FormInput
                                    type="number"
                                    name="fare"
                                    label="Fare"
                                    value={fare}
                                    className="bg-gray-100"
                                    disabled
                                  />
                                  <FormInput
                                    type="number"
                                    name="number_of_stall"
                                    label="Number of Stall"
                                    value={numberOfFare}
                                    onChange={handleNumberOfFareChange}
                                  />
                                </div>
                                <FormInput
                                  type="number"
                                  name="total_stall_fee"
                                  label="Total"
                                  value={totalFare}
                                  disabled
                                  className="bg-gray-100"
                                />
                              </>
                            ) : fieldName === "document_id" ? (
                              <>
                                <div className="grid grid-cols-12 items-center gap-4 bg-[#fffefe] p-2 rounded-lg">
                                  <div className="col-span-12 md:col-span-12 text-[18px] [#545454]">
                                    Statement Of All Legal And Supporting Documents In
                                    Favor Of Running The Business{isRequired && <span className="text-red-500 pl-1" > * </span>}
                                  </div>
                                  {configDocumentData?.data?.map(
                                    (document: Document) => (
                                      <div
                                        className="col-span-12 md:col-span-6"
                                        key={document?.id}
                                      >
                                        <div className="bg-white rounded-lg border border-spacing-2 flex justify-between items-center p-3 sm:text-sm">
                                          <div>
                                            <p>{document?.name}</p>
                                            <div className="flex sm:items-start items-center ">
                                              <span className="flex sm:items-start items-center">
                                                <Checkbox
                                                  checked={
                                                    documentStatuses[document.id] ||
                                                    false
                                                  }
                                                  onCheckedChange={(checked: boolean) =>
                                                    handleCheckboxChange(
                                                      document.id,
                                                      checked
                                                    )
                                                  }
                                                  className=""
                                                />
                                                <span className="ml-3 text-[#545454]">
                                                  Yes
                                                </span>
                                              </span>
                                              <span className="ml-5 flex sm:items-start items-center">
                                                <Checkbox
                                                  checked={
                                                    !documentStatuses[document.id]
                                                  }
                                                  onCheckedChange={(checked: boolean) =>
                                                    handleCheckboxChange(
                                                      document.id,
                                                      !checked
                                                    )
                                                  }
                                                />
                                                <span className="ml-3 text-[#545454]">
                                                  No
                                                </span>
                                              </span>
                                            </div>
                                          </div>
                                          <div></div>
                                        </div>

                                        {documentStatuses[document.id] && (
                                          <FormImageUploadWithShortText
                                            key={`upload-${document.id}`}
                                            label={`Upload ${document.name}`}
                                            name={`document_attachment_${document.id}`}
                                            placeholder="Upload Document"
                                          />
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            ) : fieldName === "profit_loss" ? (
                              <>
                                <div className="bg-[#fffefe] rounded-lg border border-spacing-2 p-3">
                                  <p className="my-3 text-[18px] text-[#545454]">
                                    Income-Expenditure Information (BDT){isRequired && <span className="text-red-500 pl-1" > * </span>}
                                  </p>
                                  <div className="border border-spacing-2 rounded-lg p-3">
                                    {fields.map((field, index) => {
                                      return (
                                        <div
                                          key={field.id}
                                          className="grid grid-cols-12 items-center gap-4"
                                        >
                                          <div className="col-span-12 md:col-span-12">
                                            <FormAutoComplete
                                              name={`user_profit_losses[${index}].financial_year_id`}
                                              data={listArrayDaynamicModify(
                                                financialYearData?.data,
                                                "financial",
                                                "name"
                                              )}
                                              singleListName="financial"
                                              label="Financial Year"
                                              placeholder=""
                                            />
                                          </div>
                                          <div className="col-span-12 md:col-span-6">
                                            <FormInput
                                              name={`user_profit_losses[${index}].yearly_total_sales`}
                                              label="Annual Gross Sales"
                                              type="number"
                                            />
                                          </div>

                                          <div className="col-span-12 md:col-span-6">
                                            <FormInput
                                              name={`user_profit_losses[${index}].yearly_total_cost`}
                                              label="Total Annual Expenditure"
                                              type="number"
                                            />
                                          </div>
                                          <div className="col-span-12 md:col-span-6">
                                            <FormInput
                                              name={`user_profit_losses[${index}].yearly_net_profit`}
                                              label="Annual Net Profit"
                                              type="number"
                                            />
                                          </div>
                                          <div className="col-span-12 md:col-span-6">
                                            <FormInput
                                              name={`user_profit_losses[${index}].bank_loan`}
                                              label="Total Liabilities/Debts"
                                              type="number"
                                            />
                                          </div>
                                          <div className="col-span-12 md:col-span-6">
                                            <FormInput
                                              name={`user_profit_losses[${index}].vat_paid`}
                                              label="Annually Paid VAT"
                                              type="number"
                                            />
                                          </div>
                                          <div className="col-span-12 md:col-span-6">
                                            <FormInput
                                              name={`user_profit_losses[${index}].income_tax_paid`}
                                              label="Annual Income Tax Paid"
                                              type="number"
                                            />
                                          </div>
                                          <div className="col-span-12 md:col-span-12 text-end">
                                            {fields.length > 1 && (
                                              <Button
                                                type="button"
                                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                                                onClick={() => remove(index)}
                                              >
                                                Delete
                                              </Button>
                                            )}
                                          </div>

                                          <div className="col-span-12 md:col-span-12 text-end">
                                            <Button
                                              type="button"
                                              className="bg-green-700 text-white rounded-lg p-1 w-[120px] text-center cursor-pointer"
                                              onClick={() =>
                                                append(defaultUserProfitLosses)
                                              }
                                            >
                                              Add More
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <FormInput
                                  type="text"
                                  name={fieldName}
                                  label={fieldNameValue}
                                  remark={isRequired}
                                />
                              </>
                            )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 text-right">
              <Button
                type="submit"
                className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              >
                Save
              </Button>
            </div>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};

export default ApplicationForm;
