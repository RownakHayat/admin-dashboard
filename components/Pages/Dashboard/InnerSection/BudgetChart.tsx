import { FormAutoCompleteOnChange } from '@/components/common/Form/FormAutoCompleteOnChange';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { useGetYeearBudgetSummaryQuery } from '@/store/features/configuration/financialYear';
import { useGetAllFinancialYearQuery } from '@/store/features/dashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const defaultSchema = z.object({
    fiscal_year_id: z.string().nonempty("Fiscal Year is required"),
});

type FormData = z.infer<typeof defaultSchema>;

const BudgetChart = () => {

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
        data: budgetActivitiesData,
        error,
    } = useGetYeearBudgetSummaryQuery(
        selectedFiscalYear ? { id: selectedFiscalYear } : undefined,
        {
            skip: !selectedFiscalYear,
        }
    );


    const handleBudgetActivitiesChange = (value: string | null) => {
        if (value) {
            setSelectedFiscalYear(value);
        } else {
            setSelectedFiscalYear(null);
        }
    }
    const totalBudget = selectedFiscalYear ? budgetActivitiesData?.data?.total_program_budget || 0 : "";
    const implementedBudget = selectedFiscalYear ? budgetActivitiesData?.data?.total_implemented_budget || 0 : "";
  
    const remainingBudget = totalBudget - implementedBudget;

    const implementedPercentage = totalBudget ? (implementedBudget / totalBudget) * 100 : 0;

    const remainingPercentage = totalBudget ? (remainingBudget / totalBudget) * 100 : 0;

    useEffect(() => {
        if (fiscalYear?.data?.length > 0) {
            let fiscalYearId = fiscalYear.data[0]?.id;

            if (budgetActivitiesData?.data?.fiscal_year_id) {
                fiscalYearId = budgetActivitiesData.data.fiscal_year_id;
            }

            setSelectedFiscalYear(fiscalYearId);
            setValue("fiscal_year_id", fiscalYearId);
        }
    }, [fiscalYear, budgetActivitiesData, setValue]);

    return (
        <div className='py-3 pt-4'>
            <div className='flex flex-wrap justify-between pb-3'>
                <h2 className="text-xl font-normal text-[#545454]">Budget Summary</h2>
                <div className='py-2 lg:py-0'>
                <FormAutoCompleteOnChange
                    name="fiscal_year_id"
                    singleListName="fiscalYear"
                    data={listArrayDaynamicModify(fiscalYear?.data, "fiscalYear", "name")}
                    label=""
                    placeholder="Select Year"
                    control={control}
                    onChange={handleBudgetActivitiesChange}
                    value={selectedFiscalYear}
                />
                </div>
            </div>
            <div className='flex justify-center py-2'>
                <div className='grid grid-cols-12 gap-2 '>
                    <div className='col-span-12 xl:col-span-4'>
                        <div style={{ width: '100%', height: '100%' }} className='bg-[#EEF0FB] box-border rounded-xl text-center p-2 '>
                            <div className='sm:text-sm text-md text-wrap my-1 text-[#2C2C2C]'>Total Budget</div>
                            <div style={{ width: '67%', }} className='inline-block mt-5 '>
                                <CircularProgressbar
                                    value={totalBudget > 0 ? 100 : 0}
                                    styles={buildStyles({
                                        backgroundColor: "",
                                        pathColor: totalBudget > 0 ? '#3b82f6' : '#e0e7ff',
                                        trailColor: '#e0e7ff',
                                    })}
                                    className=''
                                />
                                <p className=' text-[#2C2C2C]'>{totalBudget}</p>
                                {/* <p className=' text-[#2C2C2C]'> {budgetSummary?.data?.total_program_budget}</p> */}
                            </div>
                        </div>
                    </div>
                    <div className='col-span-12 xl:col-span-4'>
                        <div style={{ width: '100%', height: '100%' }} className='bg-[#F9EEEC] box-border rounded-xl text-center p-2 '>
                            <div className='sm:text-sm text-md text-wrap my-1 text-[#2C2C2C]'>Implemented Budget</div>
                            <div style={{ width: '67%', }} className='inline-block mt-5 '>
                            <CircularProgressbar
                                    value={implementedPercentage}
                                    styles={buildStyles({
                                        pathColor: '#f87171',
                                        trailColor: '#EAD5D1',
                                    })}
                                />
                                <p className=' text-[#2C2C2C] mb-1'>{implementedBudget} </p>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-12 xl:col-span-4'>
                        <div style={{ width: '100%', height: '100%' }} className='bg-[#84CFC11A] box-border rounded-xl text-center p-2 '>
                            <div className='sm:text-sm text-md text-wrap my-1 text-[#2C2C2C]'>Remaining Budget</div>
                            <div style={{ width: '67%', }} className='inline-block mt-5 '>
                            <CircularProgressbar className='w-[50%]'
                                    value={remainingPercentage}
                                    styles={buildStyles({
                                        pathColor: '#34d399',
                                        trailColor: '#CBE5E3',
                                    })}
                                />
                                <p className='text-[#2C2C2C]'>{remainingBudget}</p>
                                {/* <p className='text-[#2C2C2C]'>{remainingBudget !== 0 ? remainingBudget : ""}</p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetChart;
