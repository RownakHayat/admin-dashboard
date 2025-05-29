"use client";

import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormFileUploadProfile from "@/components/common/Form/FormFileUploadProfile";
import FormImageUploadWithShortText from "@/components/common/Form/FormImageUploadWithShortText";
import FormInput from "@/components/common/Form/FormInput";
import MultipleFileUploadUpdated from "@/components/common/Form/FormMultipleFileUploadUpdated";
import FormOnlyFileUpload from "@/components/common/Form/FormOnlyFileUpload";
import FormTextArea from "@/components/common/Form/FormTextArea";
import ImageFormUpload from "@/components/common/Form/ImageFormUpload";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import {
  ownershipSpace,
  ownershipTypes,
  rawMaterials,
} from "@/components/common/staticData/staticdata";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";
import { useGetAllServiceTypeListQuery } from "@/store/features/configuration/businessType";
import { useGetAllClusterQuery } from "@/store/features/configuration/cluster";
import { useDivisionWiseDistrictQuery } from "@/store/features/configuration/district";
import { useGetAllDivisionQuery } from "@/store/features/configuration/division";
import { useGetAllDocumentQuery } from "@/store/features/configuration/document";
import { useGetAllFinancialYearQuery } from "@/store/features/configuration/financialYear";
import { useGetAllGnderListQuery } from "@/store/features/configuration/gender";
import { useBusinessIndustrialListQuery } from "@/store/features/configuration/industrialSector";
import { useGetAllOccupationTypeQuery } from "@/store/features/configuration/occupationType";
import { useGetAllOrganizationTypeListQuery } from "@/store/features/configuration/organizationType";
import { useGetAllSmeCategoryQuery } from "@/store/features/configuration/smeCategory";
import { useDistrictWiseUpazilaQuery } from "@/store/features/configuration/upazila";
import { useEmailChangeMutation } from "@/store/features/UserManagement/emailChange";
import {
  useAuthUserQuery,
  useDeleteImageMutation,
  useUpdateUserProfileMutation,
} from "@/store/features/UserManagement/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import ChangeEmailDialog from "../ChangeEmail/ChangeEmail";
import EmailOtp from "../ChangeEmail/emailOtp";
import ChangePhoneNumberDialog from "../ChangeMobile/ChangeMobile";
import { formSchema } from "./schemas/formSchema";
import ImageCropper from "@/components/common/ImageCopper/ImageCropper";

interface Image {
  url: string;
  file: File;
  name: string;
  base64: string;
  attachment_name?: string;
  attachment?: string;
}
interface Attachment {
  attachment_name: string;
  attachment: string;
}

interface FormFileUploadProfileProps {
  name?: string;
  onProfileEdit?: (data: { file: File | null; documentId: string }) => void;
}

interface Document {
  id: number;
  name: string;
  attachment?: string | File | null;
  isCheckedYes?: boolean;
  isCheckedNo?: boolean;
}

interface ProfitLoss {
  financial_year: {
    id: number;
    name: string;
  };
  yearly_total_sales: number;
  yearly_total_cost: number;
  yearly_net_profit: number;
  bank_loan: number;
  vat_paid: number;
  income_tax_paid: number;
}

const ProfileInfoEdit = ({
  name,
  onProfileEdit,
}: FormFileUploadProfileProps) => {
  const { data: user, refetch: refetchUser } = useAuthUserQuery();
  const { data: genderList } = useGetAllGnderListQuery();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { data: serviceTypeList } = useGetAllServiceTypeListQuery();
  const { data: organizationTypeList } = useGetAllOrganizationTypeListQuery();
  const { data: allCluster } = useGetAllClusterQuery();
  const { data: allOccupation } = useGetAllOccupationTypeQuery();
  const { data: divisionList } = useGetAllDivisionQuery();
  const { data: industryList } = useBusinessIndustrialListQuery();

  const errorMessageHandle = (field: string) => {
    setErrorMessages((prevErrors: any) =>
      prevErrors.filter((error: any) => error.field !== field)
    );
  };

  const router = useRouter();

  const defaultUserProfitLosses = {
    financial_year_id: "",
    yearly_total_sales: "",
    yearly_total_cost: "",
    yearly_net_profit: "",
    bank_loan: "",
    vat_paid: "",
    income_tax_paid: "",
  };
  const currentYear = new Date().getFullYear();
  const lastThreeYears = [currentYear, currentYear - 1, currentYear - 2];

  const defaultExportedProducts = lastThreeYears.map((year) => ({
    year: year.toString(),
    export_amount: "",
    attachment: "",
  }));

  const defaultAttachments = {
    attachment_name: "",
    attachment: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      name_bn: "",
      organization_name: "",
      organization_name_bn: "",
      father_name: "",
      mother_name: "",
      spouse_name: "",
      telephone: "",
      trade_license_no: "",
      issue_date: "",
      nid: "",
      educational_qualification_id: "",
      gender_id: "",
      date_of_birth: "",
      signature_image_path: "",
      office_address: "",
      factory_address: "",
      service_type_id: "",
      organization_type_id: "",
      permanent_address: "",
      present_address: "",
      division_id: "",
      district_id: "",
      upazila_id: "",
      cluster_id: "",
      year_of_establishment: "",
      user_manufactured_goods: "",
      website: "",
      occupation_id: "",
      defaulter_status: null,
      export_status: null,
      trade_association_status: undefined,
      previous_award_status: undefined,
      ownership_type: "",
      ownership_place: "",
      raw_material_source: "",
      fair_displayed_products: "",
      trade_association_name: "",
      trade_association_name_bn: "",
      business_documents: [],
      user_profit_losses: [defaultUserProfitLosses],
      fixed_assets_with_infrastructure: undefined,
      current_assets: undefined,
      total_investment: undefined,
      fixed_assets_without_infrastructure: undefined,
      land_price: undefined,
      building_price: undefined,
      factory_mechineries_price: undefined,
      stock_product_price: undefined,
      current_capital: undefined,
      permanent_male_workers: "",
      permanent_female_workers: "",
      permanent_third_gender_workers: "",
      temporary_male_workers: "",
      temporary_female_workers: "",
      temporary_third_gender_workers: "",
      loan_status: undefined,
      loan_bank_name: "",
      loan_amount: undefined,
      monthly_installment: undefined,
      monthly_total_sales: undefined,
      monthly_total_cost: undefined,
      product_consumers: "",
      user_exported_products: defaultExportedProducts,
      user_attachments: [defaultAttachments],
      business_harmful_description: "",
      business_harmful_document_path: "",
      business_harmful_status: undefined,
      organization_policy: "",
      organization_facilities: "",
      why_successful_sme: "",
      faced_obstacles: "",
      your_contribution: "",
      taken_initiatives: "",
      account_management_system: "",
      marketing_srategy: "",
      innovation_technology: "",
      service_center_environment: "",
      sme_category_id: "",
      interested_division_fair_id: "",
      business_sector_id: "",
    },
  });

  const { data: districtList } = useDivisionWiseDistrictQuery(
    { id: form.watch("division_id") },
    {
      skip:
        form.watch("division_id") == "" ||
        form.watch("division_id") == undefined,
    }
  );
  const { data: upazilaList } = useDistrictWiseUpazilaQuery(
    { id: form.watch("district_id") },
    {
      skip:
        form.watch("district_id") == "" ||
        form.watch("district_id") == undefined,
    }
  );
  const { data: configDocumentData, refetch } = useGetAllDocumentQuery();
  const { data: financialYearData } = useGetAllFinancialYearQuery();
  const [updateUser] = useUpdateUserProfileMutation();
  const [imageDelete] = useDeleteImageMutation();
  const [documentStates, setDocumentStates] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [forceReload, setForceReload] = useState(0);
  const { data: smeCategory } = useGetAllSmeCategoryQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (activeTab === "businessInfo") {
      setForceReload((prev) => prev + 1);
      refetch();
    }

    if (configDocumentData?.data) {
      const initialStates = configDocumentData?.data?.map(
        (document: Document) => {
          const userDocument = user?.data?.document_user?.find(
            (doc: any) => doc.document_id === document.id
          );
          const attachmentUrl = userDocument?.attachment
            ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${userDocument?.attachment
            }`
            : null;

          return {
            ...document,
            isCheckedYes: !!userDocument?.attachment,
            isCheckedNo: !userDocument?.attachment,
            attachment: attachmentUrl,
          };
        }
      );

      setDocumentStates(initialStates);
    }
  }, [configDocumentData?.data, user?.data?.document_user, activeTab, refetch]);

  const handleCheckboxChange = (documentId: number, checkedYes: boolean) => {
    setDocumentStates((prevState) =>
      prevState.map((doc) =>
        doc.id === documentId
          ? {
            ...doc,
            isCheckedYes: checkedYes,
            isCheckedNo: !checkedYes,
            attachment: !checkedYes ? null : doc.attachment,
          }
          : doc
      )
    );
  };

  // const handleProfileEdit = (data: any) => {
  //   setDocumentStates((prevState) =>
  //     prevState.map((doc) =>
  //       doc.id.toString() === data.documentId
  //         ? {
  //           ...doc,
  //           attachment: data.base64String
  //             ? data.base64String
  //             : doc.attachment,
  //         }
  //         : doc
  //     )
  //   );
  // };

  const handleProfileEdit = (data: any) => {
    setDocumentStates((prevState) =>
      prevState.map((doc) =>
        doc.id.toString() === data.documentId
          ? {
            ...doc,
            attachment: data.base64String || null, // Clear the attachment if no base64String is provided
          }
          : doc
      )
    );
  };

  // const handleProfileEdit = ({ file, base64String }:any) => {
  //   if (!file && base64String === null) {
  //     console.log("File removed");
  //     // Handle file removal logic or message
  //   } else {
  //     console.log("File uploaded successfully");
  //     // Handle file upload success logic or message
  //   }
  // };

  // const handleRemoveAttachment = (documentId: number) => {
  //   setDocumentStates((prevState) =>
  //     prevState.map((doc) =>
  //       doc.id === documentId
  //         ? {
  //             ...doc,
  //             attachment: null, // Remove the attachment
  //           }
  //         : doc
  //     )
  //   );
  // };

  const handleRemoveAttachment = (documentId: number) => {
    setDocumentStates((prevState) =>
      prevState.map((doc) =>
        doc.id === documentId ? { ...doc, attachment: null } : doc
      )
    );
  };

  const initialManufacturedGoods =
    user && user?.data && user?.data?.user_manufactured_goods
      ? user?.data?.user_manufactured_goods?.map(
        (item: { manufactured_goods: string }) => item?.manufactured_goods
      )
      : [];

  const initialDisplayProducts =
    user && user?.data && user?.data?.fair_displayed_products
      ? user?.data?.fair_displayed_products?.map(
        (item: { display_product: string }) => item?.display_product
      )
      : [];

  const [texts, setTexts] = useState<string[]>(initialManufacturedGoods);
  const [productTexts, setProductTexts] = useState<string[]>(
    initialDisplayProducts
  );

  const handleProductRemoveText = (index: number) => {
    setProductTexts((prevProductTexts) =>
      prevProductTexts.filter((_, i) => i !== index)
    );
  };

  const handleAddText = () => {
    const inputValue = form.getValues("user_manufactured_goods");

    if (inputValue) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts, inputValue];
        form.setValue("user_manufactured_goods", updatedTexts.join(", "));
        return updatedTexts;
      });
      setTimeout(() => {
        form.setValue("user_manufactured_goods", "");
      }, 0);
    }
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

  const filePath = user?.data?.user_profile?.business_harmful_document_path;
  const fileExtension = filePath ? filePath.split(".").pop().toLowerCase() : "";

  const handleRemoveText = (index: number) => {
    const updatedTexts = [...texts];
    updatedTexts.splice(index, 1);
    setTexts(updatedTexts);
  };

  const onSubmitHandlerUpdate: SubmitHandler<z.infer<any>> = async (values) => {
    if (showTextEntrepreneur !== 1) {
      values.previous_award_name = "";
    }

    const baseURL = siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL || "";

    const businessHarmfulDocumentPath =
      values?.business_harmful_document_path?.startsWith(baseURL)
        ? values?.business_harmful_document_path.replace(baseURL, "")
        : values?.business_harmful_document_path ?? "";

    values.user_exported_products = values.user_exported_products.map((product: any, index: any) => {
        const attachmentImagePath = product?.attachment?.startsWith(baseURL)
          ? product.attachment.replace(baseURL, "")
          : product.attachment;

        return {
          ...product,
          year: product.year || lastThreeYears[index].toString(),
          attachment: attachmentImagePath || "",
        };
      }
    );

    const businessDocuments = documentStates.filter((doc) => doc.isCheckedYes).map((doc) => {
      let attachmentImagePath = "";

      if (
        typeof doc.attachment === "string" &&
        doc.attachment.startsWith(baseURL)
      ) {
        attachmentImagePath = doc.attachment.replace(baseURL, "");
      } else if (typeof doc.attachment === "string") {
        attachmentImagePath = doc.attachment;
      }

      return {
        document_id: doc.id,
        attachment: attachmentImagePath || "",
      };
    });
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

    const userAttachments = attachments
      .filter((attachment) => attachment?.attachment) // Ensure attachment exists
      .map((attachment) => {
        if (!attachment.attachment) {
          return null; // or handle the case where attachment is undefined
        }

        const attachmentImagePath = attachment.attachment.startsWith(baseURL)
          ? attachment.attachment.replace(baseURL, "")
          : attachment.attachment;

        return {
          attachment_name: attachment.attachment_name,
          attachment: attachmentImagePath,
        };
      })
      .filter(Boolean); // Remove any null values that may have been returned

    values.user_manufactured_goods = texts;
    values.fair_displayed_products = productTexts;
    values.business_documents = businessDocuments;
    values.user_attachments = userAttachments;
    values.business_harmful_document_path =
      user?.data?.user_profile?.business_harmful_document_path;

    values.building_price = values.building_price?.toString() || "";
    values.business_harmful_status =
      values.business_harmful_status?.toString() || "";
    values.current_assets = values.current_assets?.toString() || "";
    values.current_capital = values.current_capital?.toString() || "";
    values.current_income_tax_return_status =
      values.current_income_tax_return_status?.toString() || "";
    values.factory_mechineries_price =
      values.factory_mechineries_price?.toString() || "";
    values.fixed_assets_with_infrastructure =
      values.fixed_assets_with_infrastructure?.toString() || "";
    values.fixed_assets_without_infrastructure =
      values.fixed_assets_without_infrastructure?.toString() || "";
    values.land_price = values.land_price?.toString() || "";
    values.loan_amount = values.loan_amount?.toString() || "";
    values.loan_status = values.loan_status?.toString() || "";
    values.monthly_installment = values.monthly_installment?.toString() || "";
    values.monthly_total_cost = values.monthly_total_cost?.toString() || "";
    values.monthly_total_sales = values.monthly_total_sales?.toString() || "";
    values.permanent_female_workers =
      values.permanent_female_workers?.toString() || "";
    values.permanent_male_workers =
      values.permanent_male_workers?.toString() || "";
    values.permanent_third_gender_workers =
      values.permanent_third_gender_workers?.toString() || "";
    values.previous_award_status =
      values.previous_award_status?.toString() || "";
    values.stock_product_price = values.stock_product_price?.toString() || "";
    values.temporary_female_workers =
      values.temporary_female_workers?.toString() || "";
    values.temporary_male_workers =
      values.temporary_male_workers?.toString() || "";
    values.temporary_third_gender_workers =
      values.temporary_third_gender_workers?.toString() || "";
    values.total_investment = values.total_investment?.toString() || "";
    values.trade_association_status =
      values.trade_association_status?.toString() || "";

    // const ProfileImagePath = values?.profile_image_path.startsWith(baseURL)
    //   ? values?.profile_image_path.replace(baseURL, "")
    //   : values?.profile_image_path;

    // const signatureImagePath = values?.signature_image_path.startsWith(baseURL)
    //   ? values?.signature_image_path.replace(baseURL, "")
    //   : values?.signature_image_path;

    const ProfileImagePath = values?.profile_image_path
      ? values.profile_image_path.startsWith(baseURL)
        ? values.profile_image_path.replace(baseURL, "")
        : values.profile_image_path
      : "";

    const signatureImagePath = values?.signature_image_path
      ? values.signature_image_path.startsWith(baseURL)
        ? values.signature_image_path.replace(baseURL, "")
        : values.signature_image_path
      : "";

    const updatedValues = {
      ...values,
      date_of_birth: values?.date_of_birth
        ? moment(values?.date_of_birth).format("YYYY-MM-DD")
        : "",
      issue_date: values?.issue_date
        ? moment(values?.issue_date).format("YYYY-MM-DD")
        : "",
      year_of_establishment: values?.year_of_establishment
        ? moment(values?.year_of_establishment).format("YYYY-MM-DD")
        : "",
      current_income_tax_return_status: incomeTaxReturnStatus,
      permanent_male_workers: maleWorkers,
      permanent_female_workers: femaleWorkers,
      permanent_third_gender_workers: thirdGenderWorkers,
      temporary_male_workers: tempMaleWorkers,
      temporary_female_workers: tempFemaleWorkers,
      temporary_third_gender_workers: tempThirdGenderWorkers,
      defaulter_status: defaultedLoan,
      loan_status: takenBusinessPurpose || "",
      export_status: showExportedStatus || "",
      business_harmful_status: businessHarmfulStatus || "",
      trade_association_status: tradeAssociationStatus || "",
      previous_award_status: showTextEntrepreneur || "",
      profile_image_path: ProfileImagePath,
      signature_image_path: signatureImagePath,
    };

    const payload = {
      ...values,
      land_price: values.land_price !== undefined ? values.land_price : "", // If empty, set as ""
    };

    try {
      const mutationFn = updateUser;
      const res = await mutationFn({
        ...values,

        date_of_birth: values?.date_of_birth
          ? moment(values?.date_of_birth).format("YYYY-MM-DD")
          : "",
        issue_date: values?.issue_date
          ? moment(values?.issue_date).format("YYYY-MM-DD")
          : "",
        year_of_establishment: values?.year_of_establishment
          ? moment(values?.year_of_establishment).format("YYYY-MM-DD")
          : "",
        business_harmful_document_path: businessHarmfulDocumentPath,
        sme_category_id: values?.sme_category_id,
        interested_division_fair_id: values?.interested_division_fair_id,
        current_income_tax_return_status: incomeTaxReturnStatus,
        permanent_male_workers: maleWorkers,
        permanent_female_workers: femaleWorkers,
        permanent_third_gender_workers: thirdGenderWorkers,
        temporary_male_workers: tempMaleWorkers,
        temporary_female_workers: tempFemaleWorkers,
        profile_image_path: ProfileImagePath,
        signature_image_path: signatureImagePath,
        temporary_third_gender_workers: tempThirdGenderWorkers,
        // user_exported_products: exportedProducts,
        defaulter_status: defaultedLoan,
        loan_status: takenBusinessPurpose || "",
        export_status: showExportedStatus || "",
        business_harmful_status: businessHarmfulStatus || "",
        trade_association_status: tradeAssociationStatus || "",
        previous_award_status: showTextEntrepreneur || "",
      }).unwrap();
      if (res.code === 200) {
        await form.reset();
        Swal.fire({
          title: "Success!",
          text: "Profile Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/user-dashboard/profile");
        });
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) => {
            if (field && message) {
              form.setError(field as keyof z.infer<typeof formSchema>, {
                type: "custom",
                message,
              });
            } else {
            }
          }
        );
      } else {
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "user_profit_losses",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append(defaultUserProfitLosses);
    }
  }, [fields, append]);

  // const { fields: userExportedProducts } = useFieldArray({
  //   control: form.control,
  //   name: "user_exported_products",
  // });

  const [attachment, setAttachment] = useState<Image[]>([]);

  useEffect(() => {
    if (user) {
      const mappedProfitLosses = user.data.user_profit_loss.map(
        (item: ProfitLoss) => ({
          financial_year_id: item.financial_year?.id?.toString() || "",
          yearly_total_sales: item.yearly_total_sales?.toString() || "",
          yearly_total_cost: item.yearly_total_cost?.toString() || "",
          yearly_net_profit: item.yearly_net_profit?.toString() || "",
          bank_loan: item.bank_loan?.toString() || "",
          vat_paid: item.vat_paid?.toString() || "",
          income_tax_paid: item.income_tax_paid?.toString() || "",
        })
      );

      const appEnv = process.env.APP_ENV || "default";
      const mappedAttachments = user?.data.attachments.map(
        (attachment: any) => ({
          id: attachment.id,
          attachment_name: attachment.attachment_name,
          url: `${siteConfig?.envConfig[appEnv]?.IMAGE_URL}${attachment.attachment}`,
          file: null,
          name: attachment.attachment_name,
          base64: attachment.attachment,
        })
      );
      setAttachment(mappedAttachments || []);

      const initialDocumentStates = user.data?.document_user.map(
        (doc: any) => ({
          id: doc.document_id,
          name: doc.document.name,
          isCheckedYes: !!doc.attachment,
          isCheckedNo: !doc.attachment,
          attachment: doc.attachment
            ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${doc.attachment
            }`
            : null,
        })
      );

      setDocumentStates(initialDocumentStates);

      const businessDocuments = user.data?.document_user.map((doc: any) => ({
        document_id: doc.document_id,
        attachment: doc.attachment
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${doc.attachment
          }`
          : "",
      }));


      const mappedExportedProducts = user.data.user_exported_products.map(
        (item: any, index: any) => ({
          year: item.year?.toString() || lastThreeYears[index].toString(),
          export_amount: item.export_amount?.toString() || "",
          attachment: item.attachment
            ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${item.attachment}`
            : "",
        })
      );
      form.setValue("user_exported_products", mappedExportedProducts);
      setShowExportedStatus(user?.data?.user_profile?.export_status || null);

      if (user?.data?.attachments) {
        setAttachments(user.data.attachments);
      }

      form.reset({
        profile_image_path: user?.data?.user_profile?.profile_image_path
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.profile_image_path
          }`
          : "",
        name: user?.data?.name || "",
        name_bn: user?.data?.name_bn || "",
        organization_name: user?.data?.user_profile?.organization_name || "",
        organization_name_bn:
          user?.data?.user_profile?.organization_name_bn || "",
        father_name: user?.data?.user_profile?.father_name || "",
        mother_name: user?.data?.user_profile?.mother_name || "",
        spouse_name: user?.data?.user_profile?.spouse_name || "",
        sme_category_id:
          user?.data?.user_profile?.sme_category_id?.toString() || "",
        interested_division_fair_id:
          user?.data?.user_profile?.interested_division_fair_id?.toString() ||
          "",
        business_sector_id:
          user?.data?.user_profile?.business_sector_id?.toString() ||
          "",
        telephone: user?.data?.user_profile?.telephone || "",
        educational_qualification_id:
          user?.data?.user_profile?.educational_qualification_id || "",
        nid: user?.data?.user_profile?.nid || "",
        gender_id: user?.data?.gender_id?.toString() || "",
        date_of_birth: user?.data?.user_profile?.date_of_birth || "",
        trade_license_no: user?.data?.user_profile?.trade_license_no || "",
        issue_date: user?.data?.user_profile?.issue_date || "",
        signature_image_path: user?.data?.user_profile?.signature_image_path
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.signature_image_path
          }`
          : "",
        business_harmful_document_path: user?.data?.user_profile
          ?.business_harmful_document_path
          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${user?.data?.user_profile?.business_harmful_document_path
          }`
          : "",

        office_address: user?.data?.user_profile?.office_address || "",
        factory_address: user?.data?.user_profile?.factory_address || "",
        service_type_id:
          user?.data?.user_profile?.service_type_id?.toString() || "",
        organization_type_id:
          user?.data?.user_profile?.organization_type_id?.toString() || "",
        present_address: user?.data?.user_profile?.present_address || "",
        permanent_address: user?.data?.user_profile?.permanent_address || "",
        division_id: user?.data?.user_profile?.division_id?.toString() || "",
        district_id: user?.data?.user_profile?.district_id?.toString() || "",
        upazila_id: user?.data?.user_profile?.upazila_id?.toString() || "",
        cluster_id: user?.data?.user_profile?.cluster_id?.toString() || "",
        year_of_establishment:
          user?.data?.user_profile?.year_of_establishment || "",
        // user_manufactured_goods: user?.data?.user_profile?.user_manufactured_goods || "",
        website: user?.data?.user_profile?.website || "",
        occupation_id:
          user?.data?.user_profile?.occupation_id?.toString() || "",
        ownership_type: user?.data?.user_profile?.ownership_type || "",
        ownership_place: user?.data?.user_profile?.ownership_place || "",
        // fair_displayed_products: user?.data?.user_profile?.fair_displayed_products || "",
        raw_material_source:
          user?.data?.user_profile?.raw_material_source || "",
        trade_association_name:
          user?.data?.user_profile?.trade_association_name || "",
        trade_association_name_bn:
          user?.data?.user_profile?.trade_association_name_bn || "",
        previous_award_name:
          user?.data?.user_profile?.previous_award_name || "",
        fixed_assets_with_infrastructure:
          user?.data?.user_profile?.fixed_assets_with_infrastructure || "",
        current_assets: user?.data?.user_profile?.current_assets || "",
        total_investment: user?.data?.user_profile?.total_investment || "",
        fixed_assets_without_infrastructure:
          user?.data?.user_profile?.fixed_assets_without_infrastructure || "",
        land_price: user?.data?.user_profile?.land_price || "",

        user_profit_losses: mappedProfitLosses,

        building_price: user?.data?.user_profile?.building_price || "",

        // business_documents: user?.data?.user_profile?.document_user || [],
        business_documents: businessDocuments,

        factory_mechineries_price:
          user?.data?.user_profile?.factory_mechineries_price || "",
        stock_product_price:
          user?.data?.user_profile?.stock_product_price || "",
        current_capital: user?.data?.user_profile?.current_capital || "",
        permanent_male_workers:
          user?.data?.user_profile?.permanent_male_workers || "",
        permanent_female_workers:
          user?.data?.user_profile?.permanent_female_workers || "",
        permanent_third_gender_workers:
          user?.data?.user_profile?.permanent_third_gender_workers || "",
        temporary_male_workers:
          user?.data?.user_profile?.temporary_male_workers || "",
        temporary_female_workers:
          user?.data?.user_profile?.temporary_female_workers || "",
        temporary_third_gender_workers:
          user?.data?.user_profile?.temporary_third_gender_workers || "",
        loan_bank_name: user?.data?.user_profile?.loan_bank_name || "",
        loan_amount: user?.data?.user_profile?.loan_amount || "",
        monthly_installment:
          user?.data?.user_profile?.monthly_installment || "",
        product_consumers: user?.data?.user_profile?.product_consumers || "",
        business_harmful_description:
          user?.data?.user_profile?.business_harmful_description || "",
        organization_policy:
          user?.data?.user_profile?.organization_policy || "",
        organization_facilities:
          user?.data?.user_profile?.organization_facilities || "",
        why_successful_sme: user?.data?.user_profile?.why_successful_sme || "",
        faced_obstacles: user?.data?.user_profile?.faced_obstacles || "",
        your_contribution: user?.data?.user_profile?.your_contribution || "",
        taken_initiatives: user?.data?.user_profile?.taken_initiatives || "",
        account_management_system:
          user?.data?.user_profile?.account_management_system || "",
        marketing_srategy: user?.data?.user_profile?.marketing_srategy || "",
        innovation_technology:
          user?.data?.user_profile?.innovation_technology || "",
        service_center_environment:
          user?.data?.user_profile?.service_center_environment || "",
        monthly_total_sales:
          user?.data?.user_profile?.monthly_total_sales || "",
        monthly_total_cost: user?.data?.user_profile?.monthly_total_cost || "",
        current_income_tax_return_status:
          user?.data?.user_profile?.current_income_tax_return_status || "",
        loan_status: user?.data?.user_profile?.loan_status || "",
        business_harmful_status:
          user?.data?.user_profile?.business_harmful_status || "",
        trade_association_status:
          user?.data?.user_profile?.trade_association_status || "",
        previous_award_status:
          user?.data?.user_profile?.previous_award_status || "",
        email: user?.data?.email || "",
        mobile: user?.data?.mobile || "",
        user_exported_products: mappedExportedProducts,
      });
      setMaleWorkers(user?.data?.user_profile?.permanent_male_workers || null),
        setFemaleWorkers(
          user?.data?.user_profile?.permanent_female_workers || null
        ),
        setThirdGenderWorkers(
          user?.data?.user_profile?.permanent_third_gender_workers || 0
        ),
        setTempMaleWorkers(
          user?.data?.user_profile?.temporary_male_workers || 0
        ),
        setTempFemaleWorkers(
          user?.data?.user_profile?.temporary_female_workers || 0
        ),
        setTempThirdGenderWorkers(
          user?.data?.user_profile?.temporary_third_gender_workers || 0
        ),
        setMonthlyTotalSales(
          user?.data?.user_profile?.monthly_total_sales || 0
        );
      setMonthlyTotalCost(user?.data?.user_profile?.monthly_total_cost || 0);
      setIncomeTaxReturnStatus(
        user?.data?.user_profile?.current_income_tax_return_status || 0
      );
      setTakenBusinessPurpose(user?.data?.user_profile?.loan_status || null);
      setDefaultedLoan(user?.data?.user_profile?.defaulter_status || 0);
      setBusinessHarmfulStatus(
        user?.data?.user_profile?.business_harmful_status || 0
      );
      setTradeAssociationStatus(
        user?.data?.user_profile?.trade_association_status || null
      );
      setShowTextEntrepreneur(
        user?.data?.user_profile?.previous_award_status || null
      );
    }
  }, [user, form]);

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
  const [attachments, setAttachments] = useState<Image[]>([]);

  const handleAttachmentChange = (newImages: Image[]) => {
    const newAttachments = newImages.map((image) => ({
      ...image,
      attachment_name: image.name,
      attachment: image.base64,
    }));

    setAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];

      newAttachments.forEach((newAttachment) => {
        const existingIndex = updatedAttachments.findIndex(
          (attachment) =>
            attachment.attachment_name === newAttachment.attachment_name
        );

        if (existingIndex !== -1) {
          // Replace the existing attachment
          updatedAttachments[existingIndex] = newAttachment;
        } else {
          // Add the new attachment
          updatedAttachments.push(newAttachment);
        }
      });

      return updatedAttachments;
    });
  };

  // mobile and email start
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const oldPhoneNumber = user?.data?.mobile || "";
  const [emailOtpChange] = useEmailChangeMutation();
  const [resEmail, setresEmail] = useState<string>("");
  const [openEmailVerifyDialog, setOpenEmailVerifyDialog] = useState(false);

  const handlePhoneDialogSave = (values: any) => {
    setOpenPhoneDialog(false);
  };

  const handleEmailDialogSave = (values: any) => {
    // setOpenEmailDialog(false);
  };
  const handleEmailVerifyDialogSave = (values: any) => {
    // setOpenEmailVerifyDialog(false);
  };

  const handleOpenEmailVerifyDialog = async () => {
    const emailValue = form.getValues("email");
    // const emailValue = form.getValues();
    // const emailValue = form.getValues();
    try {
      const res = await emailOtpChange({
        email: emailValue,
      }).unwrap();
      if (res.code === 200) {
        setresEmail(res.data.email);
        setOpenEmailVerifyDialog(true);
      } else {
      }
    } catch (err: any) {
      setErrorMessages(err?.data?.errors);
    }
  };

  // mobile and email end

  // total permanent workers sum

  const { register, reset, setValue } = useForm();

  const [maleWorkers, setMaleWorkers] = useState(0);
  const [femaleWorkers, setFemaleWorkers] = useState(0);
  const [thirdGenderWorkers, setThirdGenderWorkers] = useState(0);
  const [totalPermanentWorkers, setTotalPermanentWorkers] = useState(0);

  useEffect(() => {
    setTotalPermanentWorkers(
      Number(maleWorkers) + Number(femaleWorkers) + Number(thirdGenderWorkers)
    );
  }, [maleWorkers, femaleWorkers, thirdGenderWorkers]);

  const handleInputChange = (setter: any) => (e: any) => {
    setter(Number(e.target.value) || 0);
  };

  // total Temporary workers sum

  const [tempMaleWorkers, setTempMaleWorkers] = useState(0);
  const [tempFemaleWorkers, setTempFemaleWorkers] = useState(0);
  const [tempThirdGenderWorkers, setTempThirdGenderWorkers] = useState(0);
  const [totalTempWorkers, setTotalTempWorkers] = useState(0);

  useEffect(() => {
    setTotalTempWorkers(
      Number(tempMaleWorkers) +
      Number(tempFemaleWorkers) +
      Number(tempThirdGenderWorkers)
    );
  }, [tempMaleWorkers, tempFemaleWorkers, tempThirdGenderWorkers]);

  const [tradeAssociationStatus, setTradeAssociationStatus] = useState<
    number | null
  >(null);

  const handleTradeAssociationStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "show") {
      setTradeAssociationStatus(checked ? 1 : null);
    } else if (name === "hide") {
      setTradeAssociationStatus(checked ? null : 1);
    }
  };

  const [showTextEntrepreneur, setShowTextEntrepreneur] = useState<
    number | null
  >(null);

  const handleCheckboxChangeEntrepreneur = (e: any) => {
    const { name, checked } = e.target;
    if (name === "previous_award_status_yes") {
      setShowTextEntrepreneur(checked ? 1 : null);
    } else if (name === "previous_award_status_no") {
      setShowTextEntrepreneur(checked ? null : 1);
    }
  };

  const [incomeTaxReturnStatus, setIncomeTaxReturnStatus] = useState<
    number | null
  >(null);

  const handleCheckboxChangeTex = (e: any) => {
    const { name, checked } = e.target;
    if (name === "current_income_tax_return_status_yes") {
      setIncomeTaxReturnStatus(checked ? 1 : null);
    } else if (name === "current_income_tax_return_status_no") {
      setIncomeTaxReturnStatus(checked ? null : 1);
    }
  };

  const [takenBusinessPurpose, setTakenBusinessPurpose] = useState<
    number | null
  >(null);

  const handleTakenBusinessPurpose = (e: any) => {
    const { name, checked } = e.target;
    if (name === "showBusinessPurpose_yes") {
      setTakenBusinessPurpose(checked ? 1 : null);
    } else if (name === "showBusinessPurpose_no") {
      setTakenBusinessPurpose(checked ? null : 1);
    }
  };

  const handleIncomeCost = (setter: any) => (e: any) => {
    setter(Number(e.target.value) || 0);
  };

  const handleSaleCost = (setter: any) => (e: any) => {
    setter(Number(e.target.value) || 0);
  };
  const [monthlyTotalSales, setMonthlyTotalSales] = useState(0);
  const [monthlyTotalCost, setMonthlyTotalCost] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  useEffect(() => {
    setIncomeTotal(Number(monthlyTotalSales) - Number(monthlyTotalCost));
  }, [monthlyTotalSales, monthlyTotalCost]);

  const [defaultedLoan, setDefaultedLoan] = useState<number | null>(null);

  const handleDefaultedLoan = (e: any) => {
    const { name, checked } = e.target;
    if (name === "defaulted_status_yes") {
      setDefaultedLoan(checked ? 1 : null);
    } else if (name === "defaulted_status_no") {
      setDefaultedLoan(checked ? null : 1);
    }
  };


  const [showExportedStatus, setShowExportedStatus] = useState<number | null>(null);

  // const handleExportedStatus = (e: any) => {
  //   const { name, checked } = e.target;
  //   if (name === "export_status_yes") {
  //     setShowExportedStatus(checked ? 1 : null);
  //   } else if (name === "export_status_no") {
  //     setShowExportedStatus(checked ? null : 1);
  //   }
  // };

  // const handleExportedStatus = (event: any) => {
  //   if (event.target.name === "export_status_yes") {
  //     setShowExportedStatus(1); // Yes selected
  //   } else if (event.target.name === "export_status_no") {
  //     setShowExportedStatus(null); // No selected
  //   }
  // };
  const handleExportedStatus = (event: any) => {
    if (event.target.name === "export_status_yes") {
      setShowExportedStatus(1); // Yes selected
    } else if (event.target.name === "export_status_no") {
      setShowExportedStatus(null); // No selected
      // Reset user_exported_products when selecting "No"
      form.setValue("user_exported_products", []); // Clear the array of exported products
    }
  };


  const [businessHarmfulStatus, setBusinessHarmfulStatus] = useState<
    number | null
  >(null);

  const handleBusinessHarmfulStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "business_harmful_status_yes") {
      setBusinessHarmfulStatus(checked ? 1 : 0);
    } else if (name === "business_harmful_status_no") {
      setBusinessHarmfulStatus(checked ? 0 : 1);
    }
  };

  const getImageUrl = (baseUrl: string, attachment: string): string => {
    const formattedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const formattedAttachment = attachment.startsWith("/")
      ? attachment.slice(1)
      : attachment;

    return `${formattedBaseUrl}${formattedAttachment}`;
  };

  const handleDelete = async (id: number) => {
    if (!id) {
      return;
    }

    try {
      const result = await imageDelete(id).unwrap();
    } catch (error) { }
  };

  return (
    <div className="bg-[#ffffff] p-5">
      <div>
        <FormContainer
          form={form}
          onSubmit={form.handleSubmit(onSubmitHandlerUpdate)}
        >
          <Tabs defaultValue="personalInfo" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 xss:grid-cols-1">
              <TabsTrigger value="personalInfo">
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="businessInfo">
                Business Information
              </TabsTrigger>
              <TabsTrigger value="attachment">Attachment</TabsTrigger>
            </TabsList>
            <TabsContent
              value="personalInfo"
              className="mt-48 sm:mt-20 lg:mt-5"
            >
              <div className="my-4 xss:mt-[100px] md:mt-0">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-12 md:col-span-8 mt-0">
                    {/* <FormUserImageUpload name="profile_image_path" remark={false} /> */}
                    
                    {/* <ImageFormUpload
                      name="profile_image_path"
                      label="Profile Image"
                      remark={false}
                      cropWidth={300}
                      cropHeight={300}
                      initialImage={
                        user?.data?.user_profile?.profile_image_path
                          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                            ?.IMAGE_URL
                          }${user?.data?.user_profile?.profile_image_path}`
                          : undefined
                      }
                      userId={user?.data?.id}
                    /> */}
                    <ImageCropper
                      name="profile_image_path"
                      label="Profile Image"
                      remark={false}
                      cropWidth={300}
                      cropHeight={300}
                      initialImage={
                        user?.data?.user_profile?.profile_image_path
                          ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]
                            ?.IMAGE_URL
                          }${user?.data?.user_profile?.profile_image_path}`
                          : undefined
                      }
                      userId={user?.data?.id}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4  ml-4">
                    <ol className="list-decimal">
                      {/*<li className="text-red-600 text-[12px]">*/}
                      {/*  The size of the photograph is 300 X 300 pixels.*/}
                      {/*</li>*/}
                      <li className="text-red-600 text-[12px]">
                        File size is less than 2 MB
                      </li>
                      <li className="text-red-600 text-[12px]">
                        Supported file formats are JPEG, JPG and PNG
                      </li>
                    </ol>
                  </div>
                  <div className="col-span-12 md:col-span-12 mt-0">
                    <hr className="h-px mb-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  </div>

                  {/* Personal Information start */}
                  <div className="col-span-12 md:col-span-12 mt-0  p-4">
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput
                          name="name"
                          label="Name (English)"
                          remark={true}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput
                          type="text"
                          name="name_bn"
                          label="Name (Bangla)"
                          bengaliAllow={true}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput
                          name="organization_name"
                          label="Organization Name (English)"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput
                          type="text"
                          name="organization_name_bn"
                          bengaliAllow={true}
                          label="Organization Name (Bangla)"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput name="father_name" label="Father's Name" />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput
                          type="text"
                          name="mother_name"
                          label="Mother's Name"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput name="spouse_name" label="Spouse Name" />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput name="telephone" label="Telephone" />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormInput
                          name="trade_license_no"
                          label="Trade License No."
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormDatePicker
                          name="issue_date"
                          label="Trade License Issue Date"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput name="nid" label="NID No." />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="educational_qualification_id"
                          label="Educational Qualification"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormAutoComplete
                          name="gender_id"
                          data={listArrayDaynamicModify(
                            genderList?.data,
                            "gender",
                            "name"
                          )}
                          singleListName="gender"
                          label="Gender"
                          placeholder="Select gender"
                          remark={true}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormDatePicker
                          name="date_of_birth"
                          label="Date Of Birth"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 ">
                        <FormAutoComplete
                          name="occupation_id"
                          data={listArrayDaynamicModify(
                            allOccupation?.data,
                            "occupation",
                            "name"
                          )}
                          singleListName="occupation"
                          label="Occupation"
                          placeholder="Occupation"
                          control={form.control}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 flex items-end justify-between gap-4">
                        {user?.data?.email ? (
                          <>
                            <FormInput name="email" label="Email" disabled />
                          </>
                        ) : (
                          <>
                            <FormInput
                              name="email"
                              label="Email"
                              remark={true}
                              onChange={() => errorMessageHandle("email")}
                            />
                            {errorMessages?.length > 0 && (
                              <div className="text-red-500">
                                {errorMessages.map((msg: any, index) => (
                                  <div key={index}>{msg.message}</div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        {user?.data?.email ? (
                          <Button
                            type="button"
                            className="bg-success p-3"
                            onClick={() => setOpenEmailDialog(true)}
                          >
                            Update
                          </Button>   
                        ) : (
                          <Button
                            type="button"
                            className="bg-success p-3"
                            onClick={handleOpenEmailVerifyDialog}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                      <div className="col-span-12 md:col-span-6 flex items-end justify-between gap-4">
                        <FormInput
                          name="mobile"
                          value={user?.data?.mobile}
                          label="Mobile"
                          disabled
                        />
                        <Button
                          type="button"
                          className="bg-success p-3"
                          onClick={() => setOpenPhoneDialog(true)}
                        >
                          Update
                        </Button>
                      </div>
                      <div className="col-span-12 md:col-span-12 ">
                        {/* <UploadSignture
                          name="signature_image_path"
                          label="Profile Signature"
                          className="w-32"
                        /> */}
                        {/* <FormSignUploadCrop
                          name="signature_image_path"
                          label="Profile Signature"
                          remark={false}
                          cropWidth={80}
                          cropHeight={80}
                          initialImage={
                            user?.data?.user_profile?.signature_image_path
                              ? `${siteConfig?.envConfig[
                                `${process.env.APP_ENV}`
                              ]?.IMAGE_URL
                              }${user?.data?.user_profile?.signature_image_path
                              }`
                              : undefined
                          }
                          userId={user?.data?.id}
                        /> */}
                         <ImageCropper
                           name="signature_image_path"
                           label="Profile Signature"
                           remark={false}
                           cropWidth={80}
                           cropHeight={80}
                           initialImage={
                             user?.data?.user_profile?.signature_image_path
                               ? `${siteConfig?.envConfig[
                                 `${process.env.APP_ENV}`
                               ]?.IMAGE_URL
                               }${user?.data?.user_profile?.signature_image_path
                               }`
                               : undefined
                           }
                           userId={user?.data?.id}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address" className="mt-48 sm:mt-20 lg:mt-5">
              <div className="col-span-12 md:col-span-12 mt-0 bg-[#f9f9f9] p-4 xss:mt-[100px] sm:mt-0 lg:mt-0">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-12 md:col-span-6 ">
                    <FormInput name="office_address" label="Office Address" />
                  </div>
                  <div className="col-span-12 md:col-span-6 ">
                    <FormInput name="factory_address" label="Factory Address" />
                  </div>

                  <div className="col-span-12 md:col-span-6 ">
                    <FormInput name="present_address" label="Present Address" />
                  </div>
                  <div className="col-span-12 md:col-span-6 ">
                    <FormInput
                      name="permanent_address"
                      label="Permanent Address"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6 ">
                    <FormAutoComplete
                      name="division_id"
                      data={listArrayDaynamicModify(
                        divisionList?.data,
                        "division",
                        "name"
                      )}
                      singleListName="division"
                      label="Division"
                      placeholder="Select division"
                      control={form.control}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6 ">
                    <FormAutoComplete
                      name="district_id"
                      data={listArrayDaynamicModify(
                        districtList?.data,
                        "district",
                        "name"
                      )}
                      singleListName="district"
                      label="District"
                      placeholder="Select District"
                      control={form.control}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6 ">
                    <FormAutoComplete
                      name="upazila_id"
                      data={listArrayDaynamicModify(
                        upazilaList?.data,
                        "upazila",
                        "name"
                      )}
                      singleListName="upazila"
                      label="Upazila"
                      placeholder="Select upazila"
                      control={form.control}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6 ">
                    <FormAutoComplete
                      name="cluster_id"
                      data={listArrayDaynamicModify(
                        allCluster?.data,
                        "cluster",
                        "name"
                      )}
                      singleListName="cluster"
                      label="Cluster"
                      placeholder="Select cluster"
                      control={form.control}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6 ">
                    <FormInput name="website" label="Website" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="businessInfo"
              key={forceReload}
              className="mt-48 sm:mt-20 lg:mt-5"
            >
              <div className="flex items-center  p-4">
                <p className="text-[20px] text-[#767676]">
                  Business information of the entrepreneur
                </p>
                <div className=" flex-grow border-t border-gray-300 ml-4"></div>
              </div>
              <div className="col-span-12 md:col-span-12 mt-0  p-4 rounded-lg sm:mt-0 lg:mt-0">
                <div className="bg-[#f9f9f9] rounded-lg">
                  <div className="grid grid-cols-12 items-center gap-4 p-4 rounded-lg ">
                    <div className="col-span-12 md:col-span-6">
                      <FormAutoComplete
                        name="service_type_id"
                        data={listArrayDaynamicModify(
                          serviceTypeList?.data,
                          "service",
                          "name"
                        )}
                        singleListName="service"
                        label="Business Type"
                        placeholder="Select"
                        control={form.control}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
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
                    </div>
                    <div className="col-span-12 md:col-span-6 ">
                      <FormDatePicker
                        name="year_of_establishment"
                        label="Year Of Establishment"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6 ">
                      <div className="relative flex items-center gap-4">
                        <FormInput
                          name="user_manufactured_goods"
                          placeholder=""
                          label="Manufactured Goods"
                          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-success hover:bg-success text-white rounded-md mt-8"
                          onClick={handleAddText}
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap">
                        {texts?.map((text: any, index: any) => (
                          <div key={index} className="badge-container m-2 ">
                            <div className="inline-flex items-center border-2 border-[#2b7d74] text-xs px-2 py-1 rounded-full font-bold">
                              <span className="mr-1 text-[#2b7d74]">
                                {text}
                              </span>
                              <button className="ml-1">
                                <X
                                  className="w-4 h-4 text-[#767676]"
                                  onClick={() => handleRemoveText(index)}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
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
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
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
                      />
                    </div>

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

                    <div className="col-span-12 md:col-span-6 items-center">
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
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-4  p-4">
                    <div className="col-span-12">
                      <div className="grid grid-cols-12">
                        <div className="col-span-12 md:col-span-6">
                          <p className="text-[#545454] break-words">
                            Affiliated with Associations/Tradebodies?
                          </p>
                          {/* trade_association_status */}
                          <span>
                            <input
                              type="checkbox"
                              name="show"
                              checked={tradeAssociationStatus === 1}
                              onChange={handleTradeAssociationStatus}
                            />
                            <span className="ml-2 text-[#545454]">Yes</span>
                          </span>
                          <span className="ml-4">
                            <input
                              type="checkbox"
                              name="hide"
                              checked={tradeAssociationStatus === null}
                              onChange={handleTradeAssociationStatus}
                            />
                            <span className="ml-2 text-[#545454]">No</span>
                          </span>
                        </div>
                        {tradeAssociationStatus && (
                          <div className="col-span-12 md:col-span-6">
                            <div className="flex flex-col flex-wrap xl:flex-nowrap sm:flex-row mt-5 sm:mt-0 gap-4">
                              <FormInput
                                name="trade_association_name"
                                label="Name Of Association/Tradebody"
                              />
                              <FormInput
                                name="trade_association_name_bn"
                                label="Name Of Association/Tradebody (Bangla)"
                                bengaliAllow={true}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 text-[#545454]">
                      <p>Have You Ever Received an Award as an Entrepreneur?</p>
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
                          name="previous_award_name"
                          label="Which Organization To Be And What Award?"
                        />
                      </div>
                    )}
                    <div className="col-span-12 md:col-span-6 ">
                      <FormAutoComplete
                        name="sme_category_id"
                        data={listArrayDaynamicModify(
                          smeCategory?.data,
                          "sme",
                          "name"
                        )}
                        singleListName="sme"
                        label="SME Category"
                        placeholder="Select sme"
                        control={form.control}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6 ">
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
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6 ">
                      <FormAutoComplete
                        name="business_sector_id"
                        data={listArrayDaynamicModify(
                          industryList?.data,
                          "name",
                          "name"
                        )}
                        singleListName="name"
                        label="Industrial Sector"
                        placeholder="Select Industry"
                        control={form.control}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center my-5">
                  <p className="text-[20px] text-[#767676]">
                    Business Documents
                  </p>
                  <div className=" flex-grow border-t border-gray-300 ml-4"></div>
                </div>

                <div className=" bg-[#f9f9f9] border border-spacing-2 p-4 rounded-lg">
                  <div className="grid grid-cols-12 items-center gap-4 bg-[#fffefe] p-2 rounded-lg">
                    <div className="col-span-12 md:col-span-12 text-[18px] [#545454]">
                      Statement Of All Legal And Supporting Documents In Favor
                      Of Running The Business
                    </div>
                    {documentStates?.map((document: Document) => (
                      <div
                        className="col-span-12 md:col-span-6"
                        key={document?.id}
                      >
                        <div className="bg-white rounded-lg border border-spacing-2 bllock lg:flex lg:justify-between items-center p-1 lg:p-3 sm:text-sm">
                          <div>
                            <p className=" text-wrap">
                              {document?.name}
                              {/* {document?.id} */}
                            </p>
                            <div className="flex sm:items-start items-center ">
                              <span className="flex sm:items-start items-center">
                                <Checkbox
                                  checked={document?.isCheckedYes}
                                  onCheckedChange={(checked: any) =>
                                    handleCheckboxChange(document?.id, checked)
                                  }
                                  className=""
                                />
                                <span className="ml-3 text-[#545454]">Yes</span>
                              </span>
                              <span className="ml-5 flex sm:items-start items-center">
                                <Checkbox
                                  checked={document?.isCheckedNo}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(document?.id, !checked)
                                  }
                                />
                                <span className="ml-3 text-[#545454]">No</span>
                              </span>
                            </div>
                          </div>
                          {/*  */}

                          {/*  */}
                          <div>
                            {document?.isCheckedYes && (
                              <div>
                                {document?.attachment ? (
                                  <div className="flex justify-between lg:justify-normal items-center gap-0 lg:gap-2">
                                    {typeof document?.attachment === "string" &&
                                      (document?.attachment.endsWith(".pdf") ||
                                        document?.attachment.endsWith(".doc") ||
                                        document?.attachment.endsWith(".docx") ||
                                        document?.attachment.includes(
                                          "application/pdf"
                                        ) ||
                                        document?.attachment.includes(
                                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        )) ? (
                                      <Image
                                        priority={true}
                                        src={
                                          document?.attachment.endsWith(
                                            ".pdf"
                                          ) ||
                                            document?.attachment.includes(
                                              "application/pdf"
                                            )
                                            ? "/assets/Image/pdf.png"
                                            : "/assets/Image/word.png"
                                        }
                                        alt={`Document icon for ${document?.name}`}
                                        width={100}
                                        height={100}
                                        className="w-[50px] h-[50px] documentIcon "
                                      />
                                    ) : (
                                      <p className="text-red-500">
                                        Unsupported file type
                                      </p>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveAttachment(document?.id)
                                      }
                                      className="text-red-500 hover:text-red-700 w-[30px]"
                                    >
                                      <Trash2 />
                                    </button>
                                  </div>
                                ) : (
                                  <FormFileUploadProfile
                                    name={`${document.id}_attachment`}
                                    onProfileEdit={handleProfileEdit}
                                    documentId={document.id.toString()}
                                  />
                                )}
                              </div>
                            )}
                            {/* {document.isCheckedYes && document.attachment && (
                              <FormFileUploadProfile
                                name={`${document.id}_attachment`}
                                onProfileEdit={handleProfileEdit}
                                documentId={document.id.toString()}
                              />
                            )} */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <pre>{JSON.stringify(documentStates, null, 2)}</pre> */}

                  <div className="my-4">
                    <p className="text-[#545454]">
                      Have You Filed Your Income Tax Return In The Current
                      Financial Year?
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
                        checked={incomeTaxReturnStatus === null}
                        onChange={handleCheckboxChangeTex}
                      />
                      <span className="ml-2 text-[#545454]">No</span>
                    </span>
                  </div>

                  <div className="bg-[#fffefe] rounded-lg border border-spacing-2 p-3">
                    <p className="my-3 text-[18px] text-[#545454]">
                      Income-Expenditure Information (BDT)
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
                                onClick={() => append(defaultUserProfitLosses)}
                              >
                                Add More
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* issue no : 14893 */}
                  <div className="bg-white border border-spacing-2 rounded-lg p-4 my-4">
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="fixed_assets_with_infrastructure"
                          label="Fixed Assets (BDT) (Land, Brokers, Machinery, Furniture, Transport etc.)"
                          type="number"
                        />
                        {/* <p className="text-[14px] text-[#545454]">
                          Land, Brokers, Machinery, Furniture, Transport etc.
                        </p> */}
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="current_assets"
                          label="Current Assets (Raw materials, Stocks, Goods in process of production)"
                          type="number"
                        />
                        {/* <p className="text-[14px] text-[#545454]">
                          Raw materials, Stocks, Goods in process of production
                        </p> */}
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="total_investment"
                          label="Total Investment (From the start till now)"
                          type="number"
                        />
                        {/* <p className="text-[14px] text-[#545454]">
                          From the start till now
                        </p> */}
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="fixed_assets_without_infrastructure"
                          label="Fixed Assets (Except land and factory buildings)"
                          type="number"
                        />
                        {/* <p className="text-[14px] text-[#545454]">
                          Except land and factory buildings
                        </p> */}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-spacing-2 rounded-lg p-4 my-4">
                    <p className="mb-4 text-[20px] text-[#545454]">
                      Statement of investments and other assets o business
                      applicant / partner
                    </p>
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-12 md:col-span-6">
                        {/* <FormInput
                          name="land_price"
                          label="Land Value"
                          type="number"
                        /> */}
                        <FormInput
                          // name="land_price"
                          label="Land Value"
                          type="number" // Keeps it as a number input in the form
                          {...form.register("land_price")}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="building_price"
                          label="Value Of The Building"
                          type="number"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="factory_mechineries_price"
                          label="Factories And Machineries"
                          type="number"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="stock_product_price"
                          label="Stock Products"
                          type="number"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormInput
                          name="current_capital"
                          label="Current Capital"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-spacing-2 rounded-lg p-4 my-4">
                    <div className="flex ">
                      <div>
                        <p className="mb-4 text-[17px] text-[#545454]">
                          No. Of Permanent Labours / Workers
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Male</p>
                            <Input
                              {...register("permanent_male_workers")}
                              value={maleWorkers}
                              onChange={handleInputChange(setMaleWorkers)}
                              type="number"
                            />
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Female</p>
                            <Input
                              type="number"
                              {...register("permanent_female_workers")}
                              value={femaleWorkers}
                              onChange={handleInputChange(setFemaleWorkers)}
                            />
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Third Gender</p>
                            <Input
                              type="number"
                              {...register("permanent_third_gender_workers")}
                              value={thirdGenderWorkers}
                              onChange={handleInputChange(
                                setThirdGenderWorkers
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Total</p>
                            <Input
                              name=""
                              className="bg-gray-100 "
                              value={totalPermanentWorkers}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="border border-spacing-2 mx-4"></p>
                      <div>
                        <p className="mb-4 text-[17px] text-[#545454]">
                          Number Of Temporary Labours / Workers
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Male</p>
                            <Input
                              type="number"
                              {...register("temporary_male_workers")}
                              value={tempMaleWorkers}
                              onChange={handleInputChange(setTempMaleWorkers)}
                            />
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Female</p>
                            <Input
                              type="number"
                              {...register("temporary_female_workers")}
                              value={tempFemaleWorkers}
                              onChange={handleInputChange(setTempFemaleWorkers)}
                            />
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Third Gender</p>
                            <Input
                              type="number"
                              {...register("temporary_third_gender_workers")}
                              value={tempThirdGenderWorkers}
                              onChange={handleInputChange(
                                setTempThirdGenderWorkers
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-[100px]">
                            <p className="text-[#545454]">Total</p>
                            <Input
                              name=""
                              className="bg-gray-100 "
                              value={totalTempWorkers}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-spacing-2 rounded-lg p-4 my-4">
                    <div className="my-4">
                      <p className="text-[#545454]">
                        Have Taken Any Loan For Business Purpose?
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
                    {takenBusinessPurpose && (
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
                                <span className="ml-2 text-[#545454]">Yes</span>
                              </span>
                              <span className="ml-4">
                                <input
                                  type="radio"
                                  name="defaulted_status"
                                  value="0"
                                  checked={defaultedLoan === 0}
                                  onChange={() => setDefaultedLoan(0)}
                                />
                                <span className="ml-2 text-[#545454]">No</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center p-4">
                <p className="text-[20px] text-[#545454]">
                  Other Business Information of Entrepreneur
                </p>
                <div className=" flex-grow border-t border-gray-300 ml-4"></div>
              </div>

              <div className="bg-[#f9f9f9] rounded-lg p-4 mx-3">
                <FormInput
                  name="product_consumers"
                  label="Who Are The Main Customers Of The Product Or Service?"
                />
                <div className="mt-4 p-4 bg-white border border-spacing-2 rounded-lg">
                  <p className="text-[#545454]">
                    Monthly Income Expenditure Information (BDT)
                  </p>
                  <div className="grid grid-cols-12 flex-wrap lg:justify-center lg:gap-2 w-full mt-2 ">
                    <div className="col-span-12 lg:col-span-4">
                      <div className="flex-1  text-center rounded-lg ">
                        <p className="text-left text-[#545454]">Total Sales</p>

                        <FormInput
                          type="number"
                          {...register("monthly_total_sales")}
                          value={monthlyTotalSales}
                          onChange={handleSaleCost(setMonthlyTotalSales)}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <div className="flex-1  text-center rounded-lg  large">
                        <p className="text-left text-[#545454]">Total Cost</p>
                        <FormInput
                          type="number"
                          {...register("monthly_total_cost")}
                          value={monthlyTotalCost}
                          onChange={handleSaleCost(setMonthlyTotalCost)}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 lg:cols-span-4">
                      <div className="flex-1  text-center rounded-lg ">
                        <p className="text-left text-[#545454]">Net Profit</p>
                        <p className="form-input border border-spacing-2 rounded-lg p-[7px] h-[40px]">
                          {incomeTotal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-spacing-2 rounded-lg p-4 mt-4 bg-white">
                  <div>
                    <p className="text-[#545454]">Are The Products Exported Abroad?</p>
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
                            How Much Total Goods/Services Have Been Exported In The Last Three Years? (US Dollars). Affidavits Must Be filed In Support Of The Answer. For Example -Export Proceeds Realization Certificate (PRC)
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


                <div className="border border-spacing-2 rounded-lg p-4 mt-4 bg-white">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-6">
                      <div className="my-4">
                        <p className="text-[#545454]">
                          Is The Product/Service Directly Or Indirectly Harmful
                          to The Environment?
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
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="business_harmful_description"
                        label="Argument In Favor"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-12">
                      <FormOnlyFileUpload
                        name="business_harmful_document_path"
                        label="Attachment"
                        accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        existingFilePath={
                          user?.data?.user_profile
                            ?.business_harmful_document_path
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="organization_policy"
                        label="Mention The Policies Of The Organization"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        Job Rules, Management Policies And Standard Operating
                        System If Any
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="organization_facilities"
                        label="Mention What Are The Security And Other Facilities Of The Institution?"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>

                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="why_successful_sme"
                        label="Why Consider Yourself As A Successful Entrepreneur?"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="faced_obstacles"
                        label="What Kind Of Obstacles Have You Faced In Developing Yourself As An Entrepreneur In The Prevailing Socio-Economic Context And How Did You Overcome Them?"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="your_contribution"
                        label="How Are You Contributing To The Development Of Small And Medium Industries And Poverty Alleviation?"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="taken_initiatives"
                        label="Mention What Initiatives Have Been Taken To Improve The Skills Of Workers And Protect Their Rights"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="account_management_system"
                        label="Describe The Organization's Accounting System"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="marketing_srategy"
                        label="Describe The Product/Service Marketing Strategy"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="innovation_technology"
                        label="Describe The Product/Service Production Or Innovation Technology"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-6 mt-2">
                      <FormTextArea
                        name="service_center_environment"
                        label="Describe The Production/Service Center Environment"
                      />
                      <p className="text-[13px] text-[#545454] pt-2">
                        (Describe In Maximum 100 Words)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachment" className="mt-48 sm:mt-20 lg:mt-5">
              {/* <MultipleFileUploadNew onImagesChange={handleAttachmentChange} /> */}
              <MultipleFileUploadUpdated
                onImagesChange={handleAttachmentChange}
                existingImages={attachment}
              />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-12 mt-0">
              <div className="flex gap-5 justify-end">
                <Button
                  type="submit"
                  className="bg-[#2b7d74] hover:bg-[#2b7d74] p-5"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </FormContainer>

        <ChangePhoneNumberDialog
          open={openPhoneDialog}
          oldPhoneNumber={oldPhoneNumber}
          onClose={() => setOpenPhoneDialog(false)}
          onSave={handlePhoneDialogSave}
        />
        <ChangeEmailDialog
          open={openEmailDialog}
          onClose={() => setOpenEmailDialog(false)}
          onSave={handleEmailDialogSave}
        />

        {openEmailVerifyDialog && (
          <EmailOtp
            open={openEmailVerifyDialog}
            onClose={() => setOpenEmailVerifyDialog(false)}
            verifiedEmail={resEmail}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileInfoEdit;
