"use client"

import FormContainer from '@/components/common/Form/FormContainer';
import { FormAutoCompleteByNameForReport } from '@/components/common/FormForReport/FormAutoCompleteByNameForReport';
import { FormAutoCompleteForReport } from '@/components/common/FormForReport/FormAutoCompleteForReport';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useDivisionWiseDistrictQuery } from '@/store/features/configuration/district';
import { useGetAllDivisionQuery } from '@/store/features/configuration/division';
import { useGetAllGenderQuery } from '@/store/features/configuration/gender';
import { useDistrictWiseUpazilaQuery } from '@/store/features/configuration/upazila';
import { useGetSmeUserListByYearReportQuery } from '@/store/features/report/smeUserListByYear';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import ReportTable from './Components/ReportTable.tsx/ReportTable';

export const formSchema = z.object({
  year: z.string().optional().nullable(),
  gender_id: z.string().optional().nullable(),
  division_id: z.string().optional().nullable(),
  district_id: z.string().optional().nullable(),
  upazila_id: z.string().optional().nullable(),

});

const SmeUserListByYearList = () => {

  const {
    params,
  } = useFormSetting()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "",
      gender_id: "",
      division_id: "",
      district_id: "",
      upazila_id: "",
    },
  });


  const [yearValue, setYearValue] = useState<string | null | undefined>(undefined)
  const [genderValue, setGenderValue] = useState<string | null | undefined>(undefined)
  const [divisionValue, setDivisionValue] = useState<string | null | undefined>(undefined)
  const [districtValue, setDistrictValue] = useState<string | null | undefined>(undefined)
  const [upazilaValue, setUpazilaValue] = useState<string | null | undefined>(undefined)
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { data: allGender } = useGetAllGenderQuery();
  const { data: divisionList } = useGetAllDivisionQuery();
  const { data: districtData } = useDivisionWiseDistrictQuery(
    { id: form.watch("division_id") },
    { skip: form.watch("division_id") == "" || form.watch("division_id") == undefined });

  const { data: upazileData } = useDistrictWiseUpazilaQuery(
    { id: form.watch("district_id") },
    { skip: form.watch("district_id") == "" || form.watch("district_id") == undefined, }
  );

  const { data: tableData, isError, } = useGetSmeUserListByYearReportQuery(({
    ...params,
    year: yearValue,
    gender_id: genderValue,
    division_id: divisionValue,
    district_id: districtValue,
    upazila_id: upazilaValue,
  }), { skip: isInitialRender }
  );

  function generateYears() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];

    for (let i = 0; i < 5; i++) {
      yearsArray.push({
        id: i + 1,
        name: (currentYear - i).toString()
      });
    }

    return yearsArray;
  }

  const yearsJSON = generateYears();

  // const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
  //   setIsInitialRender(false);
  //   setYearValue(values?.year)
  //   setGenderValue(values?.gender_id)
  //   setDivisionValue(values?.division_id)
  //   setDistrictValue(values?.district_id)
  //   setUpazilaValue(values?.upazila_id)
  // }

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    setIsInitialRender(false);

    // Check and handle 'Select All' or other static options
    const filteredYear = values.year === "selectAll" ? "" : values.year;
    const filteredGender = values?.gender_id === "selectAll" ? "" : values?.gender_id;
    const filteredDivision = values.division_id === "selectAll" ? "" : values.division_id;
    const filteredDistrict = values.district_id === "selectAll" ? "" : values.district_id;
    const filteredUpazila = values.upazila_id === "selectAll" ? "" : values.upazila_id;

    setYearValue(filteredYear);
    setGenderValue(filteredGender);
    setDivisionValue(filteredDivision);
    setDistrictValue(filteredDistrict);
    setUpazilaValue(filteredUpazila);
  };

  return (
    <div className='mx-4'>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="bg-headerbg p-5 mb-3 flex justify-between">
            <p className="text-2xl">SME User List by Year Report</p>
          </div>

        </div>
        <div className="col-span-12"  >
          <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3" >
                <FormAutoCompleteByNameForReport
                  name="year"
                  label="Year"
                  singleListName="name"
                  placeholder="Select Year"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    yearsJSON,
                    "name",
                    "name"
                  )}
                  staticOptions={[
                    { value: "selectAll", label: "Select All" },
                  ]}
                  isDisabled={false}
                />
              </div>
              <div className="col-span-3" >
                <FormAutoCompleteForReport
                  name="gender_id"
                  label="Select Gender"
                  singleListName="name"
                  placeholder="Select Gender"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    allGender?.data,
                    "name",
                    "name"
                  )}
                  staticOptions={[
                    { value: "selectAll", label: "Select All" },
                  ]}
                  isDisabled={false}
                />
              </div>
              <div className="col-span-2" >
                {/* <FormAutoComplete
                  name="division_id"
                  data={listArrayDaynamicModify(
                    divisionList?.data,
                    "name",
                    "name"
                  )}
                  label="Division"
                  singleListName="name"
                  placeholder="Select division"
                  control={form.control}
                /> */}
                <FormAutoCompleteForReport
                  name="division_id"
                  label="Division"
                  singleListName="name"
                  placeholder="Select division"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    divisionList?.data,
                    "name",
                    "name"
                  )}
                  staticOptions={[
                    { value: "selectAll", label: "Select All" },
                  ]}
                  isDisabled={false}
                />
              </div>
              <div className="col-span-2" >
                {/* <FormAutoComplete
                  name="district_id"
                  data={listArrayDaynamicModify(
                    districtData?.data,
                    "name",
                    "name"
                  )}
                  label="Select District"
                  singleListName="name"
                  placeholder="Select District"
                  control={form.control}
                /> */}
                <FormAutoCompleteForReport
                  name="district_id"
                  label="District"
                  singleListName="name"
                  placeholder="Select District"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    districtData?.data,
                    "name",
                    "name"
                  )}
                  staticOptions={[
                    { value: "selectAll", label: "Select All" },
                  ]}
                  isDisabled={false}
                />
              </div>
              <div className="col-span-2" >
                <FormAutoCompleteForReport
                  name="upazila_id"
                  label="Upazila"
                  singleListName="name"
                  placeholder="Select Upazila"
                  control={form.control}
                  data={listArrayDaynamicModify(
                    upazileData?.data,
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
        <div>
          {
            !isError && !isInitialRender ? <>
              <ReportTable reportData={tableData} />
            </> : <></>
          }
        </div>
      </div>
    </div>
  )
}




export default SmeUserListByYearList
