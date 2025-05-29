import { FormAutoCompleteOnChange } from "@/components/common/Form/FormAutoCompleteOnChange";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { useGetYearProgramActivitiesQuery } from "@/store/features/configuration/financialYear";
import { useGetAllFinancialYearQuery } from "@/store/features/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const defaultSchema = z.object({
  fiscal_year_id: z.string().nonempty("Fiscal Year is required"),
});

type FormData = z.infer<typeof defaultSchema>;

export const ActivitiesInImplementation = () => {
  const { data: fiscalYear } = useGetAllFinancialYearQuery();
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(defaultSchema),
    defaultValues: {
      fiscal_year_id: selectedFiscalYear || "",
    },
  });

  const { handleSubmit, control, setValue } = form;


  const {
    data: programActivitiesData,
    error,
  } = useGetYearProgramActivitiesQuery(
    selectedFiscalYear ? { id: selectedFiscalYear } : undefined,
    {
      skip: !selectedFiscalYear,
    }
  );


  const handleProgramProgressActivitiesChange = (value: string | null) => {
    if (value) {
      setSelectedFiscalYear(value);
    } else {
      setSelectedFiscalYear(null);
    }
  }


  useEffect(() => {
    if (fiscalYear?.data?.length > 0) {
      let fiscalYearId = fiscalYear.data[0]?.id;

      if (programActivitiesData?.data?.fiscal_year_id) {
        fiscalYearId = programActivitiesData.data.fiscal_year_id;
      }

      setSelectedFiscalYear(fiscalYearId);
      setValue("fiscal_year_id", fiscalYearId);
    }
  }, [fiscalYear, programActivitiesData, setValue]);

  const allPrograms = selectedFiscalYear ? programActivitiesData?.data?.total_program || 0 : 0;
  const implementedPrograms = selectedFiscalYear ? programActivitiesData?.data?.program_implemented || 0 : 0;
  const inProgressPrograms = selectedFiscalYear ? programActivitiesData?.data?.program_in_progress || 0 : 0;

  return (
    <>

      <div className="px-4 ">
        <div className='flex flex-wrap justify-between items-center'>
          <div className='text-xl font-normal text-[#545454] mt-3'>
            Activities in Implementation
          </div>
          <div className='float-right lg:text-start xl:text-start mt-3'>
            <FormAutoCompleteOnChange
              name="fiscal_year_id"
              singleListName="fiscalYear"
              data={listArrayDaynamicModify(fiscalYear?.data, "fiscalYear", "name")}
              label=""
              placeholder="Select Year"
              control={control}
              className="!w-[170px]"
              onChange={handleProgramProgressActivitiesChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 pb-8 mt-6">
          <div className="col-span-12 xl:col-span-4">
            <div className="border border-spacing-2 rounded-lg py-6 pl-4 pr-4 w-full h-[200px] sm:flex sm:justify-center sm:items-center lg:block">
             <div className="sm:text-center lg:text-start">
              <div className="bg-green-200 rounded-full w-fit p-3 sm:ml-4 lg:ml-0">
                  <p className="text-[#2C2C2C] bg-green-200 rounded-full w-[10%]"><AlignCenter /></p>
              </div>
                <p className="text-[#2C2C2C] mt-2">All Program</p>
                <p className="text-[#2C2C2C] text-[30px] leading-snug">{allPrograms}</p>
             </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-4 ">
            <div className="border border-spacing-2 rounded-lg py-6 pl-4 pr-4 w-full h-[200px] sm:flex sm:justify-center sm:items-center lg:block">
              <div className="sm:text-center lg:text-start">
              <div className="bg-green-200 rounded-full w-fit p-3 sm:ml-[3.5rem] lg:ml-0">
                <p className="text-[#2C2C2C]"><AlignRight /></p>
              </div>
              <p className="text-[#2C2C2C] mt-2">Program Implemented</p>
              <p className="text-[#2C2C2C] text-[30px] leading-snug">{implementedPrograms}</p>
              </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-4">
            <div className="border border-spacing-2 rounded-lg py-6 pl-4 pr-4 w-full h-[200px] sm:flex sm:justify-center sm:items-center lg:block">
             <div className="sm:text-center lg:text-start">
             <div className="bg-green-200 rounded-full w-fit p-3 sm:ml-[3rem] lg:ml-0">
                <p className="text-[#2C2C2C]"><AlignLeft /></p>
              </div>
              <p className="text-[#2C2C2C] mt-2">Program in progress</p>
              <p className="text-[#2C2C2C] text-[30px] leading-snug">{inProgressPrograms}</p>
             </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}

export default ActivitiesInImplementation