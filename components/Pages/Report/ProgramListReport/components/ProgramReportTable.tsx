import EmptyData from '@/components/common/SideEffect/EmptyData';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

const ProgramReportTable = ({ programReportData }: any) => {

  const [print, setPrint] = useState(false)
  useEffect(() => {
    if (programReportData?.data?.length > 0) {
      setPrint(true)
    } else {
      setPrint(false)
    }
  }, [programReportData, setPrint]);

  const componentRef = useRef(null);

  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Program List Reports",
    onAfterPrint: () => console.log("Print Success"),
  })

  const handleRowClick = (program: any) => {
    window.location.href = `/admin/event-management/new-program/create-program/${program?.id}/edit`;
  };
  const handleEventClick = (event: any) => {
    window.location.href = `/admin/event-management/new-event/create-event/${event?.id}/edit`;
  };

  useEffect(() => {
    if (programReportData?.data?.length > 0) {
      setPrint(true);
    } else {
      setPrint(false);
    }
  }, [programReportData, setPrint]);


  const handleDownloadExcel = () => {
    const rows = [];

    rows.push([
      "SL.",
      "Program",
      "Target Event",
      "Implemented Event",
      "Complete (%)",
      "Budget",
      "Expense",
      "Expense Ratio (%)",
      "Income"
    ]);

    programReportData?.data?.forEach((program: any, index: number) => {
      rows.push([]);

      rows.push([
        index + 1,
        program?.name_en,
        program?.target_of_event,
        program?.implemented_events,
        ((program?.implemented_events / program?.target_of_event) * 100).toFixed(2),
        program?.total_amount,
        program?.budget_spent,
        ((program?.budget_spent / program?.total_amount) * 100).toFixed(2),
        program?.event_details?.reduce((sum: any, event: any) => sum + (event?.event_income || 0), 0),
      ]);

      if (program?.event_details?.length > 0) {
        rows.push([]);

        rows.push([
          " ",
          "Event Title",
          "Venue",
          "Date",
          "Participants",
          "Expense",
          "Income",
        ]);

        program?.event_details?.forEach((event: any) => {
          rows.push([
            " ",
            event?.event_name,
            event?.venue,
            `${moment(event?.start_date).format("DD MMM YYYY")} - ${moment(event?.end_date).format("DD MMM YYYY")}`,
            event?.attendance,
            event?.spent_amount,
            event?.event_income,
          ]);
        });
      }
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");
    const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    const fileName = `ProgramListReport_${formattedDate}_${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Program List Reports");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <style>{`
      @media print {
        @page {
          margin: 20mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
        .hide-in-print {
          display: none !important;
        }
      }
    `}</style>
      <div className="mt-8">
        <div className='flex items-center justify-end'>
          <div className='mt-4 mr-3'>
            {
              print && <Image
                src="/assets/Image/print.svg"
                alt="Reload"
                width={20}
                height={20}
                className='cursor-pointer'
                onClick={() => handleClickToPrint()}
              />
            }
          </div>

          <div className=''>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
              onClick={handleDownloadExcel}
            >
              <Icons.download className="text-white" /> <span className="pl-4">Download Excel File</span>
            </Button>
          </div>
        </div>
        {programReportData?.data?.length > 0 ? (
          <div ref={componentRef}>
            {/* Header */}
            <div className="text-center pb-6">
              <h1 className="text-3xl font-semibold text-gray-800">Program List Reports</h1>
              <p className="text-lg text-gray-600">SME Foundation</p>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="w-full text-sm text-left text-gray-600">
                {/* Table Header */}
                <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-center">SL.</th>
                    <th className="p-4">Program</th>
                    <th className="p-4 text-center">Target Event</th>
                    <th className="p-4 text-center">Implemented Event</th>
                    <th className="p-4 text-center">Complete (%)</th>
                    <th className="p-4 text-center">Budget</th>
                    <th className="p-4 text-center">Expense</th>
                    <th className="p-4 text-center">Expense Ratio (%)</th>
                    <th className="p-4 text-center">Income</th>
                    <th className="p-4 hide-in-print">Action</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {programReportData?.data?.map((program: any, index: number) => {
                    // Calculate the sum of incomes for event_details
                    const totalIncome = program?.event_details?.reduce(
                      (sum: number, event: any) => sum + (event?.event_income || 0),
                      0
                    );

                    return (
                      <>
                        {/* Main program row */}
                        <tr className="border-t-2 hover:bg-gray-100" key={`program-${index}`}>
                          <td className="p-4 text-center">{index + 1}</td>
                          <td className="p-4 font-medium text-gray-800">{program?.name_en}</td>
                          <td className="p-4 text-center">{program?.target_of_event}</td>
                          <td className="p-4 text-center">{program?.implemented_events}</td>
                          <td className="p-4 text-center">
                            {((program?.implemented_events / program?.target_of_event) * 100).toFixed(2)}%
                          </td>
                          <td className="p-4 text-center">{program?.total_amount}</td>
                          <td className="p-4 text-center">{program?.budget_spent}</td>
                          <td className="p-4 text-center">
                            {((program?.budget_spent / program?.total_amount) * 100).toFixed(2)}%
                          </td>
                          <td className="p-4 text-center">{totalIncome}</td>
                          <td className="p-4 text-center hide-in-print">
                            <Icons.edit
                              onClick={() =>
                                handleRowClick(program)
                              }
                            />
                          </td>
                        </tr>

                        {/* Event Details */}
                        {program?.event_details?.length > 0 && (
                          <tr key={`event-details-${index}`} >
                            <td colSpan={9} className="p-4 bg-gray-50">
                              <div className="flex justify-end">
                                <table className="w-[90%] border-t text-sm">
                                  <thead className="bg-gray-200 text-gray-600">
                                    <tr>
                                      <th className="p-4">Event Title</th>
                                      <th className="p-4">Venue</th>
                                      <th className="p-4">Date</th>
                                      <th className="p-4">Participants</th>
                                      <th className="p-4">Expense</th>
                                      <th className="p-4">Income</th>
                                      <th className="p-4 hide-in-print">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {program?.event_details?.map((event: any, eventIndex: number) => (
                                      <tr key={`event-${index}-${eventIndex}`} className="hover:bg-gray-100">
                                        <td className="p-4">{event?.event_name}</td>
                                        <td className="p-4">{event?.venue}</td>
                                        <td className="p-4">
                                          {moment(event?.start_date).format('DD MMM YYYY')} -{' '}
                                          {moment(event?.end_date).format('DD MMM YYYY')}
                                        </td>
                                        <td className="p-4">{event?.attendance}</td>
                                        <td className="p-4">{event?.spent_amount}</td>
                                        <td className="p-4">{event?.event_income}</td>
                                        <td className="p-4 hide-in-print">
                                          <Icons.edit
                                            onClick={() =>
                                              handleEventClick(event)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        ) : (
          <EmptyData />
        )}
      </div>
    </>
  );
};

export default ProgramReportTable;
