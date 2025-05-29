"use client"

import {FormAutoComplete} from '@/components/common/Form/FormAutoComplete';
import FormContainer from '@/components/common/Form/FormContainer';
import {useFormSetting} from '@/components/common/hooks/useFormSetting';
import {listArrayDaynamicModify} from '@/components/common/lib/globalFunction';
import {Button} from '@/components/ui/button';
import {useGetAllWingSectionQuery} from '@/store/features/configuration/wing';
import {useGetAllFinancialYearQuery} from '@/store/features/dashboard';
import {useGetIsrStatusReportQuery} from '@/store/features/report/isrStatusReport';
import {zodResolver} from '@hookform/resolvers/zod';
import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useReactToPrint} from 'react-to-print';
import {z} from 'zod';
import ReportTable from './Components/ReportTable/ReportTable';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const formSchema = z.object({
    wing_id: z.string().min(1, {message: "This field is required"}),
    financial_year_id: z.string().min(1, {message: "This field is required"}),
    month: z.string().min(1, {message: "This field is required"}),
});

const IsrStatusReportList = () => {

    const {
        params,
    } = useFormSetting()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            wing_id: "",
            financial_year_id: "",
            month: "",
        },
    });


    const [wingValue, setWingValue] = useState("")
    const [yearValue, setYearValue] = useState("")
    const [monthValue, setMonthValue] = useState("")
    const [monthName, setMonthName] = useState("")
    const [print, setPrint] = useState(false)
    const [isInitialRender, setIsInitialRender] = useState(true);

    const {data: getAllWingSection} = useGetAllWingSectionQuery();
    const {data: getAllfiscalYear} = useGetAllFinancialYearQuery();

    const {
        data: tableData,
        isError,
    } = useGetIsrStatusReportQuery(({
        ...params,
        wing_id: wingValue,
        financial_year_id: yearValue,
        month: monthValue,
    }), {skip: isInitialRender || wingValue === null || wingValue === undefined || yearValue === null || yearValue === undefined})

    const getMonthNameById = (id: any) => {
        const month = monthList.find((item) => item.id == id);
        return month ? month.name : ""; // Return "Not Found" if no match
    };


    useEffect(() => {
        setMonthName(getMonthNameById(monthValue));
    }, [monthValue, form.watch('month')])


    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
        setWingValue(values?.wing_id === "selectAll" ? "" : values?.wing_id)
        setYearValue(values?.financial_year_id === "selectAll" ? "" : values?.financial_year_id)
        setMonthValue(values?.month === "selectAll" ? "" : values?.month)

        const wing = form.watch("wing_id");
        const year = form.watch("financial_year_id");
        const month = form.watch("month");
        if (wing && year && month) {
            setIsInitialRender(false);
        }
    }

    const componentRef = useRef(null);

    const handleClickToPrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "ISR Satus Report",
        onAfterPrint: () => console.log("Print Success"),
    })

    const handleDownloadPDF = async () => {
        if (!componentRef.current) return;

        const element = componentRef.current as HTMLElement;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("ISR_Report.pdf");
    };

    return (
        <div className='mx-4'>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <div className="bg-headerbg p-5 mb-3 flex justify-between">
                      <div>
                        <p className="text-2xl">Implementation Status Report (Monthly)</p>
                      </div>
                      <div className="flex justify-between gap-5">
                        {

                            print &&
                            <>
                                <Image
                                    src="/assets/Image/print.svg"
                                    alt="Reload"
                                    width={20}
                                    height={20}
                                    className='cursor-pointer'
                                    onClick={() => handleClickToPrint()}
                                />
                                <Button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded"
                                    onClick={handleDownloadPDF}
                                >
                                    Download PDF
                                </Button>
                            </>
                        }
                      </div>
                    </div>

                </div>
                <div className="col-span-12">
                    <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-12 gap-4">

                            <div className="col-span-4">
                                <FormAutoComplete
                                    name="wing_id"
                                    data={listArrayDaynamicModify(
                                        getAllWingSection?.data,
                                        "name",
                                        "name"
                                    )}
                                    singleListName="name"
                                    label="Wing/Section"
                                    placeholder="Select Wing"
                                    remark={true}
                                    control={form.control}
                                    // staticOptions={[{ value: "selectAll", label: "Select All" }]}
                                />
                            </div>
                            <div className="col-span-4">
                                <FormAutoComplete
                                    name="financial_year_id"
                                    data={listArrayDaynamicModify(
                                        getAllfiscalYear?.data,
                                        "name",
                                        "name"
                                    )}
                                    label="Financial Year"
                                    singleListName="name"
                                    placeholder="Select Year"
                                    remark={true}
                                    control={form.control}
                                    // staticOptions={[{ value: "selectAll", label: "Select All" }]}
                                />
                            </div>
                            <div className="col-span-4">
                                <FormAutoComplete
                                    name="month"
                                    data={listArrayDaynamicModify(
                                        monthList,
                                        "name",
                                        "name"
                                    )}
                                    label="Month"
                                    singleListName="name"
                                    placeholder="Select Month"
                                    remark={true}
                                    control={form.control}
                                    // staticOptions={[{ value: "selectAll", label: "Select All" }]}
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
                    {
                        !isError && !isInitialRender ? <>
                            <ReportTable ReportData={tableData} setPrint={setPrint} monthName={monthName}/>
                        </> : <></>
                    }
                </div>
            </div>
        </div>
    )
}


const monthList = [
    {
        "id": 1,
        "name": "January"
    },
    {
        "id": 2,
        "name": "February"
    },
    {
        "id": 3,
        "name": "March"
    },
    {
        "id": 4,
        "name": "April"
    },
    {
        "id": 5,
        "name": "May"
    },
    {
        "id": 6,
        "name": "June"
    },
    {
        "id": 7,
        "name": "July"
    },
    {
        "id": 8,
        "name": "August"
    },
    {
        "id": 9,
        "name": "September"
    },
    {
        "id": 10,
        "name": "October"
    },
    {
        "id": 11,
        "name": "November"
    },
    {
        "id": 12,
        "name": "December"
    }
]

export default IsrStatusReportList
