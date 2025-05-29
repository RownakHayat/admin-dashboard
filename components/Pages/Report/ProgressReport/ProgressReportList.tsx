"use client";

import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormContainer from "@/components/common/Form/FormContainer";
import { FormAutoCompleteForReport } from "@/components/common/FormForReport/FormAutoCompleteForReport";
import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useGetAllWingSectionQuery } from "@/store/features/configuration/wing";
import { useGetAllFinancialYearQuery } from "@/store/features/dashboard";
import { useGetProgressReportQuery } from "@/store/features/report/progress-report";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";
import ReportTable from "./Components/ReportTable/ReportTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const formSchema = z.object({
  wing_id: z.string().optional().nullable(),
  fiscal_year_id: z.string().min(1, { message: "This field is required" }),
});

const ProgressReportList = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wing_id: "",
      fiscal_year_id: "",
    },
  });

  const { params } = useFormSetting();
  const [yearValue, setYearValue] = useState<string | null | undefined>(
      undefined
  );
  const [wingValue, setWingValue] = useState<string | null | undefined>(
      undefined
  );
  const [print, setprint] = useState(false);

  const { data: getAllWingSection } = useGetAllWingSectionQuery();
  const { data: getAllfiscalYear } = useGetAllFinancialYearQuery();
  const { data: progressReportData } = useGetProgressReportQuery(
      {
        ...params,
        wing_id: wingValue,
        fiscal_year_id: yearValue,
      },
      { skip: wingValue == undefined || wingValue == null }
  );

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
      values
  ) => {
    setWingValue(values.wing_id === "selectAll" ? "" : values.wing_id);
    setYearValue(values?.fiscal_year_id);
  };

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Financial Year Report",
    onAfterPrint: () => console.log("Print Success"),
  });

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;

    const element = componentRef.current as HTMLElement;
    const canvas = await html2canvas(element, { scale: 2 }); // Higher scale for better quality
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 0;
    const overlap = 10;

    while (yPosition < imgHeight) {
      pdf.addImage(
          imgData,
          "PNG",
          0,
          -yPosition,
          imgWidth,
          imgHeight
      );

      yPosition += pageHeight - overlap;
      if (yPosition < imgHeight) pdf.addPage();
    }

    pdf.save("Progress_Report.pdf");
  };

  return (
      <div className="mx-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="bg-headerbg p-5 mb-3 flex justify-between">
              <p className="text-2xl">Progress Report</p>
              <div className="flex gap-4">
                {print && (
                    <>
                    <Image
                        src="/assets/Image/print.svg"
                        alt="Print"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={handleClickToPrint}
                    />
                      <Button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded"
                          onClick={handleDownloadPDF}
                      >
                        Download PDF
                      </Button>
                    </>
                )}

              </div>
            </div>
          </div>
          <div className="col-span-12">
            <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormAutoComplete
                      name="fiscal_year_id"
                      label="Financial Year"
                      singleListName="name"
                      placeholder="Select Year"
                      remark={true}
                      control={form.control}
                      data={listArrayDaynamicModify(
                          getAllfiscalYear?.data,
                          "name",
                          "name"
                      )}
                  />
                </div>
                <div className="col-span-6">
                  <FormAutoCompleteForReport
                      name="wing_id"
                      label="Wing/Section"
                      singleListName="name"
                      placeholder="Select Wing"
                      control={form.control}
                      data={listArrayDaynamicModify(
                          getAllWingSection?.data,
                          "name",
                          "name"
                      )}
                      staticOptions={[
                        { value: "selectAll", label: "Select All" },
                      ]}
                      isDisabled={false}
                  />
                </div>
                <div className="col-span-12 mt-4">
                  <div className="flex justify-end gap-5">
                    <Button
                        type="button"
                        className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                        onClick={() => {
                          form.reset();
                        }}
                    >
                      Clear
                    </Button>

                    <Button
                        type="submit"
                        className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </FormContainer>
          </div>
        </div>
        <div>
          <div ref={componentRef}>
            <ReportTable
                progressReportData={progressReportData}
                setprint={setprint}
            />
          </div>
        </div>
      </div>
  );
};

export default ProgressReportList;
