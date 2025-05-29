"use client";

import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import { FormAutoCompleteOnChange } from "@/components/common/Form/FormAutoCompleteOnChange";
import FormContainer from "@/components/common/Form/FormContainer";
import FormDatePicker from "@/components/common/Form/FormDatePicker";
import FormImageUploadWithShortText from "@/components/common/Form/FormImageUploadWithShortText";
import FormInput from "@/components/common/Form/FormInput";
import FormTextArea from "@/components/common/Form/FormTextArea";
import ImageCropper from "@/components/common/ImageCopper/ImageCropper";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import {
  ownershipSpace,
  ownershipTypes,
  rawMaterials,
} from "@/components/common/staticData/staticdata";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { useGetAllServiceTypeListQuery } from "@/store/features/configuration/businessType";
import { useGetAllClusterQuery } from "@/store/features/configuration/cluster";
import { useDivisionWiseDistrictQuery } from "@/store/features/configuration/district";
import { useGetAllDivisionQuery } from "@/store/features/configuration/division";
import { useGetAllDocumentQuery } from "@/store/features/configuration/document";
import { useGetAllGnderListQuery } from "@/store/features/configuration/gender";
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
  usePublishEventMutation,
} from "@/store/features/eventManagement/newEvent";
import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z, ZodObject } from "zod";
import { Audio, CirclesWithBar, RotatingLines } from "react-loader-spinner";

// Define an initial empty schema
type MatchedField = {
  id: string;
  field_value: string;
  default_value?: string;
  field_name: string;
  is_required: number;
};
type DefaultValuesType = Record<string, any>;

interface Document {
  id: string;
  name: string;
  attachment?: string | File | null;
  isCheckedYes?: boolean;
  isCheckedNo?: boolean;
}

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
  organization_type_id: z.string().optional().nullable(),
  service_type_id: z.string().optional().nullable(),
  business_sector_id: z.string().optional().nullable(),
  office_address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  organization_name: z.string().optional().nullable(),
  telephone: z.string().optional().nullable(),
  factory_address: z.string().optional().nullable(),
  //====================================== fourth Section
  trade_license_no: z.string().optional().nullable(),
  trade_association_status: z.union([z.string(), z.number()]).optional(),
  year_of_establishment: z.string().optional().nullable(),
  ownership_type: z.string().optional().nullable(),
  raw_material_source: z.string().optional().nullable(),
  ownership_place: z.string().optional().nullable(),
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
});

const EventApplicationViewForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [matchedFields, setMatchedFields] = useState<MatchedField[]>([]);
  const [dynamicSchema, setDynamicSchema] =
    useState<ZodObject<any>>(initialSchema);
  const [defaultValues, setDefaultValues] = useState<DefaultValuesType>({});

  // Initialize form with initial (empty) schema
  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  const { data: allOccupation } = useGetAllOccupationTypeQuery();
  const { data: smeCategory } = useGetAllSmeCategoryQuery();
  const { data: allCluster } = useGetAllClusterQuery();
  const { data: divisionList } = useGetAllDivisionQuery();
  const { data: organizationTypeList } = useGetAllOrganizationTypeListQuery();
  const { data: serviceTypeList } = useGetAllServiceTypeListQuery();
  const { data: industryList } = useBusinessIndustrialListQuery();

  const [updateEventUser] = usePublishEventMutation();

  const divisionId = form.watch("division_id");
  const { data: districtList } = useDivisionWiseDistrictQuery(
    { id: divisionId },
    { skip: !divisionId }
  );

  const district_id = form.watch("district_id");

  const { data: upazilaList } = useDistrictWiseUpazilaQuery(
    { id: district_id },
    { skip: !district_id }
  );

  // ============================================ Stall Type
  const { data: stalltype } = useGetAllStallTypeQuery();
  const [selectedStall, setSelectedStall] = useState<any>(null);
  const {
    data: stallDetails,
    isLoading: isStallLoading,
    error: stallError,
  } = useDisplayStallTypeQuery(selectedStall, { skip: !selectedStall });

  const [fare, setFare] = useState<number | string>("");
  const [numberOfFare, setNumberOfFare] = useState<number | string>("");
  const [totalFare, setTotalFare] = useState<number | string>("");

  const handleSaleCost = (setter: any) => (e: any) => {
    setter(Number(e.target.value) || 0);
  };

  const [monthlyTotalSales, setMonthlyTotalSales] = useState(0);
  const [monthlyTotalCost, setMonthlyTotalCost] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);

  useEffect(() => {
    setIncomeTotal(Number(monthlyTotalSales) - Number(monthlyTotalCost));
  }, [monthlyTotalSales, monthlyTotalCost]);

  const { data: user, refetch: refetchUser } = useAuthUserQuery();

  const handleProductRemoveText = (index: number) => {
    setProductTexts((prevProductTexts) =>
      prevProductTexts.filter((_, i) => i !== index)
    );
  };

  const initialDisplayProducts =
    user && user?.data && user?.data?.fair_displayed_products
      ? user?.data?.fair_displayed_products?.map(
          (item: { display_product: string }) => item?.display_product
        )
      : [];

  const [productTexts, setProductTexts] = useState<string[]>(
    initialDisplayProducts
  );

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

  useEffect(() => {}, [fare]);

  const handleNumberOfFareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      // Check if the value is non-negative
      setNumberOfFare(value);
      calculateTotalFare(fare, value);
    }

    if (value >= 0 && value !== -1) {
      // Prevent -1 and negative values
      setNumberOfFare(value);
      calculateTotalFare(fare, value);
    } else if (value < 0) {
    }
  };

  const calculateTotalFare = (
    fareValue: number | string,
    numberOfFareValue: number | string
  ) => {
    const total = Number(fareValue) * Number(numberOfFareValue);

    setTotalFare(total || 0);
  };

  //===========================Document Status
  const { data: configDocumentData, refetch } = useGetAllDocumentQuery();

  const [documentStatuses, setDocumentStatuses] = useState<
    Record<string, boolean>
  >({});

  const handleCheckboxChange = (documentId: string, checked: boolean) => {
    setDocumentStatuses((prevStatuses) => ({
      ...prevStatuses,
      [documentId]: checked,
    }));
  };

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

  const { data: financialYearData } = useGetAllFinancialYearQuery();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "user_profit_losses",
  });
  useEffect(() => {
    if (fields.length === 0) {
      append(defaultUserProfitLosses);
    }
  }, [fields, append]);

  //   No. Of Permanent Labours / Workers
  const [maleWorkers, setMaleWorkers] = useState<number | string>("");
  const [femaleWorkers, setFemaleWorkers] = useState<number | string>("");
  const [thirdGenderWorkers, setThirdGenderWorkers] = useState<number | string>(
    ""
  );
  const [totalPermanentWorkers, setTotalPermanentWorkers] = useState<
    number | string
  >("");

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

  // Number Of Temporary Labours / Workers
  const [tempMaleWorkers, setTempMaleWorkers] = useState<number | string>("");
  const [tempFemaleWorkers, setTempFemaleWorkers] = useState<number | string>(
    ""
  );
  const [tempThirdGenderWorkers, setTempThirdGenderWorkers] = useState<
    number | string
  >("");
  const [totalTempWorkers, setTotalTempWorkers] = useState<number | string>("");
  const { data: genderList } = useGetAllGnderListQuery();

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

  // Fetch event details
  const {
    data: eventDetails,
    isLoading,
    error,
  } = useGetSingleEventDetailsQuery({ id: id }, { skip: !id });
  const { data: getAllEventListField } = useGetAllEventListFieldQuery();

  const [tradeAssociationStatus, setTradeAssociationStatus] = useState<
    number | null
  >(null);

  const handleTradeAssociationStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "show" && checked) {
      setTradeAssociationStatus(1);
    } else if (name === "hide" && checked) {
      setTradeAssociationStatus(null);
    }
  };

  const [previousAwardStatus, setPreviousAwardStatus] = useState<number | null>(
    null
  );

  const handlepreviousAwardStatusStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "show" && checked) {
      setPreviousAwardStatus(1);
    } else if (name === "hide" && checked) {
      setPreviousAwardStatus(null);
    }
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

  const [loanStatus, setLoanStatus] = useState<number | null>(null);

  const handleLoanStatus = (e: any) => {
    const { name, checked } = e.target;
    if (name === "loanShow" && checked) {
      setLoanStatus(1);
    } else if (name === "loanHide" && checked) {
      setLoanStatus(null);
    }
  };

  const [defaultLoan, setDefaultLoan] = useState<number | null>(null);

  const handleDefaultLoan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "defaultLoanShow" && checked) {
      setDefaultLoan(1);
    } else if (name === "defaultLoanHide" && checked) {
      setDefaultLoan(null);
    }
  };

  const [exportedAbroad, setExportedAbroad] = useState<number | null>(null);

  const handleExportedAbrod = (e: any) => {
    const { name, checked } = e.target;
    setExportedAbroad(name === "exportedAbrodShow" && checked ? 1 : 0);
    // if (name === "exportedAbrodShow") {
    //   setExportedAbroad(checked ? 1 : 0);
    // } else if (name === "exportedAbrodHide") {
    //   setExportedAbroad(checked ? 0 : 1);
    // }
  };

  const [businessHarmful, setBusinessHarmful] = useState<number | null>(null);

  const handleBusinessHarmful = (e: any) => {
    const { name, checked } = e.target;
    if (name === "businessShow") {
      setBusinessHarmful(checked ? 1 : 0);
    } else if (name === "businessHide") {
      setBusinessHarmful(checked ? 0 : 1);
    }
  };

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
        schemaShape[fieldName] =
          field.is_required === 1
            ? z.string().min(1, "This field is required")
            : z.string().optional().nullable();
      });

      // Update state with new values and schema
      setDefaultValues(newDefaultValues);
      setDynamicSchema(z.object(schemaShape));

      // Reset the form with new default values and schema
      form.reset({
        ...defaultValues,
      });
    }
  }, [eventDetails, getAllEventListField, isLoading]);

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

  const baseURL =
    siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL || "";

  const onSubmit = async (values: any) => {};

  const handlePublishClick = async (eventId: string) => {
    try {
      const mutationFn = updateEventUser;
      const res = await mutationFn({ id: eventId }).unwrap();

      if (res.code === 200) {
        await form.reset();
        Swal.fire({
          title: "Success!",
          text: "Form Published Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push("/admin/event-management/new-event");
        });
      }
    } catch (error) {}
  };

  const currentYear = new Date().getFullYear();
  const lastThreeYears = [currentYear, currentYear - 1, currentYear - 2];

  const defaultExportedProducts = lastThreeYears.map((year) => ({
    year: year.toString(),
    export_amount: "",
    attachment: "",
  }));

  return (
    <div className="bg-[#ffffff] rounded-lg border-2 border-gray-300 p-4">
      <div className="mx-2">
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            {Object.keys(defaultValues).map((fieldName: any, index: any) => {
              const matchedField = matchedFields?.find(
                (field: MatchedField) => field.field_value === fieldName
              );

              const fieldID = matchedField?.id || `${fieldName}-${index}`;
              const fieldNameValue =
                matchedField?.field_name || "Unknown Field Name";
              const isRequired = matchedField?.is_required === 1;
              // const fieldID = matchedField?.i
              return (
                <>
                  <div key={fieldID} className="col-span-12 md:col-span-6">
                    {/* {JSON.stringify(fieldName, null, 2)} */}

                    <div className="grid grid-cols-1">
                      {fieldName === "date_of_birth" ||
                      fieldName === "year_of_establishment" ? (
                        <div className="col-span-1">
                          <FormDatePicker
                            name={fieldName}
                            label={fieldNameValue}
                            remark={isRequired}
                          />
                        </div>
                      ) : fieldName === "occupation_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "land_price" ? (
                        <>
                          <FormInput
                            name="land_price"
                            label="Land Value"
                            type="number"
                          />
                        </>
                      ) : fieldName === "building_price" ? (
                        <>
                          <FormInput
                            name="building_price"
                            label="Value Of The Building"
                            type="number"
                          />
                        </>
                      ) : fieldName === "factory_mechineries_price" ? (
                        <>
                          <FormInput
                            name="factory_mechineries_price"
                            label="Factories And Machineries"
                            type="number"
                          />
                        </>
                      ) : fieldName === "stock_product_price" ? (
                        <>
                          <FormInput
                            name="stock_product_price"
                            label="Stock Products"
                            type="number"
                          />
                        </>
                      ) : fieldName === "total_investment" ? (
                        <>
                          <FormInput
                            name="total_investment"
                            label="Total Investment (From the start till now)"
                            type="number"
                          />
                        </>
                      ) : fieldName === "current_capital" ? (
                        <>
                          <FormInput
                            name="current_capital"
                            label="Current Capital"
                            type="number"
                          />
                        </>
                      ) : fieldName === "monthly_total_sales" ? (
                        <>
                          <div className="mt-4 p-4 bg-white border border-spacing-2 rounded-lg">
                            <p className="text-[#545454]">
                              Monthly Income Expenditure Information (BDT)
                            </p>
                            <div className="flex flex-wrap gap-2 w-full mt-2 justify-center">
                              <div className="flex-1  text-center rounded-lg ">
                                <p className="text-left text-[#545454]">
                                  Total Sales
                                </p>

                                <FormInput
                                  type="number"
                                  {...form.register("monthly_total_sales")}
                                  value={monthlyTotalSales}
                                  onChange={handleSaleCost(
                                    setMonthlyTotalSales
                                  )}
                                />
                              </div>
                              <div className="flex-1  text-center rounded-lg  large">
                                <p className="text-left text-[#545454]">
                                  Total Cost
                                </p>
                                <FormInput
                                  type="number"
                                  {...form.register("monthly_total_cost")}
                                  value={monthlyTotalCost}
                                  onChange={handleSaleCost(setMonthlyTotalCost)}
                                />
                              </div>
                              <div className="flex-1  text-center rounded-lg ">
                                <p className="text-left text-[#545454]">
                                  Net Profit
                                </p>
                                <p className="form-input border border-spacing-2 rounded-lg p-[7px] h-[40px]">
                                  {incomeTotal}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : fieldName === "fair_displayed_products" ? (
                        <>
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
                          </div>

                          <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12 md:col-span-6">
                              <div className="flex items-center flex-wrap gap-2">
                                {Array.isArray(productTexts) &&
                                  productTexts.map((text, index) => (
                                    <div
                                      key={index}
                                      className="badge-container mx-2 "
                                    >
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
                          </div>
                        </>
                      ) : fieldName === "cluster_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "division_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "district_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "upazila_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "interested_division_fair_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "organization_policy" ? (
                        <>
                          <FormTextArea
                            name="organization_policy"
                            label="Mention The Policies Of The Organization"
                          />
                          <p className="text-[13px] text-[#545454]">
                            Job Rules, Management Policies And Standard
                            Operating System If Any
                          </p>
                        </>
                      ) : fieldName === "product_consumers" ? (
                        <>
                          <FormInput
                            name="product_consumers"
                            label="Who Are The Main Customers Of The Product Or Service?"
                          />
                        </>
                      ) : fieldName === "organization_facilities" ? (
                        <>
                          <FormTextArea
                            name="organization_facilities"
                            label="Mention What Are The Security And Other Facilities Of The Institution?"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "why_successful_sme" ? (
                        <>
                          <FormTextArea
                            name="why_successful_sme"
                            label="Why Consider Yourself As A Successful Entrepreneur?"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "faced_obstacles" ? (
                        <>
                          <FormTextArea
                            name="faced_obstacles"
                            label="What Kind Of Obstacles Have You Faced In Developing Yourself As An Entrepreneur In The Prevailing Socio-Economic Context And How Did You Overcome Them?"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "your_contribution" ? (
                        <>
                          <FormTextArea
                            name="your_contribution"
                            label="How Are You Contributing To The Development Of Small And Medium Industries And Poverty Alleviation?"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "account_management_system" ? (
                        <>
                          <FormTextArea
                            name="account_management_system"
                            label="Describe The Organization's Accounting System"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "marketing_srategy" ? (
                        <>
                          <FormTextArea
                            name="marketing_srategy"
                            label="Describe The Product/Service Marketing Strategy"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "innovation_technology" ? (
                        <>
                          <FormTextArea
                            name="innovation_technology"
                            label="Describe The Product/Service Production Or Innovation Technology"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "service_center_environment" ? (
                        <>
                          <FormTextArea
                            name="service_center_environment"
                            label="Describe The Production/Service Center Environment"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "taken_initiatives" ? (
                        <>
                          <FormTextArea
                            name="taken_initiatives"
                            label="Mention What Initiatives Have Been Taken To Improve The Skills Of Workers And Protect Their Rights"
                          />
                          <p className="text-[13px] text-[#545454]">
                            (Describe In Maximum 100 Words)
                          </p>
                        </>
                      ) : fieldName === "sme_category_id" ? (
                        <div className="col-span-1">
                          <>
                            <FormAutoComplete
                              name={fieldName}
                              data={listArrayDaynamicModify(
                                smeCategory?.data,
                                "sme",
                                "name"
                              )}
                              singleListName="sme"
                              label={fieldNameValue}
                              placeholder="Select SME"
                              control={form.control}
                              remark={isRequired}
                            />
                          </>
                        </div>
                      ) : fieldName === "profit_loss" ? (
                        <>
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
                      ) : fieldName === "ownership_type" ? (
                        <>
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
                        </>
                      ) : fieldName === "ownership_place" ? (
                        <>
                          <FormAutoComplete
                            name="ownership_place"
                            data={listArrayDaynamicModify(
                              ownershipSpace,
                              "ownershipPlace",
                              "name"
                            )}
                            singleListName="ownershipPlace"
                            label="Ownership Space"
                            placeholder="Select"
                            control={form.control}
                            remark={isRequired}
                          />
                        </>
                      ) : fieldName === "raw_material_source" ? (
                        <>
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
                        </>
                      ) : fieldName === "organization_type_id" ? (
                        <>
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
                            remark={isRequired}
                          />
                        </>
                      ) : fieldName === "trade_license_no" ? (
                        <>
                          <FormInput
                            name="trade_license_no"
                            label="Trade License No."
                          />
                          <FormDatePicker
                            name="issue_date"
                            label="Trade License Issue Date"
                          />
                        </>
                      ) : fieldName === "gender_id" ? (
                        <>
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
                        </>
                      ) : fieldName === "trade_association_status" ? (
                        <>
                          <div className="col-span-12 md:col-span-6">
                            <p className="text-[#5B6471]">
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
                              <span className="ml-2 text-[#5B6471]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="hide"
                                checked={tradeAssociationStatus === null}
                                onChange={handleTradeAssociationStatus}
                              />
                              <span className="ml-2 text-[#5B6471]">No</span>
                            </span>
                          </div>
                          {tradeAssociationStatus && (
                            <div className="col-span-12 md:col-span-6">
                              <div className="flex space-x-4">
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
                        </>
                      ) : fieldName === "business_harmful_status" ? (
                        <>
                          <div>
                            <p className="text-[#5B6471]">
                              Is The Product/Service Directly Or Indirectly
                              Harmful to The Environment?
                            </p>
                            <span>
                              <input
                                type="checkbox"
                                name="businessShow"
                                checked={businessHarmful === 1}
                                onChange={handleBusinessHarmful}
                              />
                              <span className="ml-2 text-[#5B6471]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="businessHide"
                                checked={businessHarmful === 0}
                                onChange={handleBusinessHarmful}
                              />
                              <span className="ml-2 text-[#5B6471]">No</span>
                            </span>
                          </div>
                        </>
                      ) : fieldName === "current_income_tax_return_status" ? (
                        <>
                          <div className="col-span-12 md:col-span-6 text-[#5B6471]">
                            <p>
                              Have You Filed Your Income Tax Return In The
                              Current Financial Year?
                            </p>
                            <span>
                              <input
                                type="checkbox"
                                name="show"
                                checked={incomeText === 1}
                                onChange={handleIncomeText}
                              />
                              <span className="ml-2 text-[#5B6471]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="hide"
                                checked={incomeText === null}
                                onChange={handleIncomeText}
                              />
                              <span className="ml-2 text-[#5B6471]">No</span>
                            </span>
                          </div>
                          {incomeText && <></>}
                        </>
                      ) : fieldName === "service_type_id" ? (
                        <>
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
                            remark={isRequired}
                          />
                        </>
                      ) : fieldName === "business_sector_id" ? (
                        <>
                          <FormAutoComplete
                            name="business_sector_id"
                            data={listArrayDaynamicModify(
                              industryList?.data,
                              "name",
                              "name"
                            )}
                            singleListName="name"
                            label="Industrial Sector"
                            placeholder="Select"
                            control={form.control}
                            remark={isRequired}
                          />
                        </>
                      ) : fieldName === "permanent_male_workers" ? (
                        <>
                          <div>
                            <p className="mb-4 text-[17px] text-[#545454]">
                              No. Of Permanent Labours / Workers
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Male</p>
                                <Input
                                  type="number"
                                  {...form.register("permanent_male_workers")}
                                  value={maleWorkers}
                                  onChange={handleInputChange1(
                                    setMaleWorkers,
                                    "male"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Female</p>
                                <Input
                                  type="number"
                                  {...form.register("permanent_female_workers")}
                                  value={femaleWorkers}
                                  onChange={handleInputChange1(
                                    setFemaleWorkers,
                                    "female"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Third Gender</p>
                                <Input
                                  type="number"
                                  {...form.register(
                                    "permanent_third_gender_workers"
                                  )}
                                  value={thirdGenderWorkers}
                                  onChange={handleInputChange1(
                                    setThirdGenderWorkers,
                                    "thirdGender"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Total</p>
                                <Input
                                  className="bg-gray-100"
                                  value={totalPermanentWorkers}
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
                              Number Of Temporary Labours / Workers
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Male</p>
                                <Input
                                  type="number"
                                  {...form.register("temporary_male_workers")}
                                  value={tempMaleWorkers}
                                  onChange={handleInputChange(
                                    setTempMaleWorkers,
                                    "male"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Female</p>
                                <Input
                                  type="number"
                                  {...form.register("temporary_female_workers")}
                                  value={tempFemaleWorkers}
                                  onChange={handleInputChange(
                                    setTempFemaleWorkers,
                                    "female"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Third Gender</p>
                                <Input
                                  type="number"
                                  {...form.register(
                                    "temporary_third_gender_workers"
                                  )}
                                  value={tempThirdGenderWorkers}
                                  onChange={handleInputChange(
                                    setTempThirdGenderWorkers,
                                    "thirdGender"
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-[100px]">
                                <p className="text-[#545454]">Total</p>
                                <Input
                                  className="bg-gray-100"
                                  value={totalTempWorkers}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : fieldName === "stall_type_id" ? (
                        <>
                          <div className="grid grid-cols-12 ">
                            <div className="col-span-12 md:col-span-12">
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
                                className="w-full "
                              />

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
                                name="numberoffare"
                                label="Number of Fare"
                                value={numberOfFare}
                                onChange={handleNumberOfFareChange}
                                min="0"
                              />
                              <FormInput
                                type="number"
                                name="numberoffareTotal"
                                label="Total"
                                value={totalFare}
                                disabled
                                className="bg-gray-100"
                              />
                            </div>
                          </div>
                        </>
                      ) : fieldName === "document_id" ? (
                        <>
                          <div className="grid grid-cols-12 items-center gap-4 bg-[#fffefe] p-2 rounded-lg">
                            {/* <div className="col-span-12 md:col-span-12 text-[18px] [#545454]">
                              Statement Of All Legal And Supporting Documents In
                              Favor Of Running The Business
                            </div> */}
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
                                            onCheckedChange={(
                                              checked: boolean
                                            ) =>
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
                                            onCheckedChange={(
                                              checked: boolean
                                            ) =>
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
                      ) : fieldName === "loan_status" ? (
                        <>
                          <div className="col-span-12 md:col-span-6 text-[#5B6471]">
                            <p>Have Taken Any Loan For Business Purpose?</p>
                            <span>
                              <input
                                type="checkbox"
                                name="loanShow"
                                checked={loanStatus === 1}
                                onChange={handleLoanStatus}
                              />
                              <span className="ml-2 text-[#5B6471]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="loanHide"
                                checked={loanStatus === null}
                                onChange={handleLoanStatus}
                              />
                              <span className="ml-2 text-[#5B6471]">No</span>
                            </span>
                          </div>
                          {loanStatus && (
                            <>
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
                                    <div className="my-4 text-[#5B6471]">
                                      <p>Have You Ever Defaulted On A Loan?</p>
                                      <span>
                                        <input
                                          type="checkbox"
                                          name="defaultLoanShow"
                                          checked={defaultLoan === 1}
                                          onChange={handleDefaultLoan}
                                        />
                                        <span className="ml-2 text-[#5B6471]">
                                          Yes
                                        </span>
                                      </span>
                                      <span className="ml-4">
                                        <input
                                          type="checkbox"
                                          name="defaultLoanHide"
                                          checked={defaultLoan === null}
                                          onChange={handleDefaultLoan}
                                        />
                                        <span className="ml-2 text-[#5B6471]">
                                          No
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : fieldName === "previous_award_status" ? (
                        <>
                          <div className="col-span-12 md:col-span-6 text-[#5B6471]">
                            <p>
                              Have You Ever Received an Award as an
                              Entrepreneur?
                            </p>
                            <span>
                              <input
                                type="checkbox"
                                name="show"
                                checked={previousAwardStatus === 1}
                                onChange={handlepreviousAwardStatusStatus}
                              />
                              <span className="ml-2 text-[#5B6471]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="hide"
                                checked={previousAwardStatus === null}
                                onChange={handlepreviousAwardStatusStatus}
                              />
                              <span className="ml-2 text-[#5B6471]">No</span>
                            </span>
                          </div>
                          {previousAwardStatus && (
                            <div className="col-span-12 md:col-span-6 ">
                              <FormInput
                                name="previous_award_name"
                                label="Which Organization To Be And What Award?"
                              />
                            </div>
                          )}
                        </>
                      ) : fieldName === "export_status" ? (
                        <>
                          <div className="col-span-12 text-[#5B6471]">
                            <p>Are The Products Exported Abroad?</p>
                            <span>
                              <input
                                type="checkbox"
                                name="exportedAbrodShow"
                                checked={exportedAbroad === 1}
                                onChange={handleExportedAbrod}
                              />
                              <span className="ml-2 text-[#5B6471]">Yes</span>
                            </span>
                            <span className="ml-4">
                              <input
                                type="checkbox"
                                name="exportedAbrodHide"
                                checked={exportedAbroad === 0}
                                onChange={handleExportedAbrod}
                              />
                              <span className="ml-2 text-[#5B6471]">No</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-12 items-center col-span-12">
                            <div className="col-span-12">
                              {exportedAbroad === 1 && (
                                <>
                                  <p className="text-[14px] text-[#767676] mt-3">
                                    <span className="text-red-500">*</span>
                                    How Much Total Goods/Services Have Been
                                    Exported In The Last Three Years? (US
                                    Dollars). Affidavits Must Be filed In
                                    Support Of The Answer. For Example -Export
                                    Proceeds Realization Certificate (PRC)
                                  </p>
                                  <div className="grid grid-cols-12 mt-4">
                                    <div className="col-span-12 flex flex-wrap justify-between ">
                                      {lastThreeYears.map((year, index) => (
                                        <div
                                          key={year}
                                          className="col-span-12 md:col-span-4 lg:col-span-4 w-full"
                                        >
                                          <div className="block lg:flex items-center lg:justify-between border border-spacing-2 rounded-lg bg-white p-3 lg:mx-2">
                                            <div className="lg:mr-2 ">
                                              <p className="text-[#545454]">
                                                Amount
                                              </p>
                                              <Input
                                                type="text"
                                                {...form.register(
                                                  `user_exported_products.${index}.export_amount`
                                                )}
                                                placeholder="Enter Amount"
                                              />
                                            </div>
                                            <div className="w-full">
                                              <FormImageUploadWithShortText
                                                label={year.toString()}
                                                {...form.register(
                                                  `user_exported_products.${index}.attachment`
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      ) : fieldName === "signature_image_path" ||
                        fieldName === "profile_image_path" ? (
                        <>
                          {/* <FormImageUploadCrop
                              name={fieldName}
                              label={fieldNameValue}
                              remark={isRequired}
                              cropWidth={80}
                              cropHeight={80}
                              initialImage={""}
                            /> */}
                          <ImageCropper
                            name={fieldName}
                            label={fieldNameValue}
                            remark={isRequired}
                            cropWidth={80}
                            cropHeight={80}
                            initialImage={""}
                          />
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
                </>
              );
            })}
          </div>
        </FormContainer>
        <div className="grid grid-cols-12 gap-4 mt-3">
          <div className="col-span-6 text-right">
            <Button
              type="button"
              className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              onClick={() =>
                router.push(
                  `/admin/event-management/new-event/create-event/${id}/apply-event`
                )
              }
            >
              Edit
            </Button>
          </div>
          <div className="col-span-6 text-right">
            <Button
              type="submit"
              className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              onClick={() => handlePublishClick(id)}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventApplicationViewForm;
