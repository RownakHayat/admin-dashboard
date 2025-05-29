
import EmptyData from '@/components/common/SideEffect/EmptyData';
import { useGetReportDetailQuery } from '@/store/features/configuration/reportHeaderFooter';
import { useEffect, useState } from 'react';
import BusinessSupport from '../BusinessSupport/BusinessSupport';
import FinancialTable from '../FinancialTable/FinancialTable';
import ProgressReportGraph from '../Graph/Graph';

interface TableRow {
  wing_name: string;
  year_round_targets: number;
  implementation: number;
  percentage_against_annual_target: string;
  amount_allocated_annually: string;
  actual_cost: string;
  expenditure_rate_of_allocated_funds: string;
  proceeds_from_events_programs: string;
}

const ReportTable = ({ progressReportData, setprint, reportDetail }: any) => {

  const { data: listQuery} = useGetReportDetailQuery();


  const stripHtmlTags = (htmlString: string | null | undefined) => {
    if (!htmlString) return "";
    return htmlString.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
  };



  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [fiscalYear, setFiscalYear] = useState<string>('');
  const [yearStart, yearEnd] = fiscalYear.split("-");
  const fullYearEnd = `20${yearEnd}`;
  useEffect(() => {
    if (progressReportData?.data) {
      const data = progressReportData.data;

      const extractedData: TableRow[] = Object.keys(data)
        .filter(key => !['financial_year', 'graph', 'wing_details'].includes(key))
        .map(key => data[key]);

      setTableData(extractedData);
      setFiscalYear(data.financial_year?.name || '');
    }
  }, [progressReportData]);


  if (tableData.length > 0) {
    setprint(true)
  } else {
    setprint(false)
  }

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
        .first-page {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh; /* Full viewport height */
        text-align: center;
        }
      .first-page a {
      white-space: warp; /* Prevent the link from wrapping */
      }
      }
    `}</style>
      <div className="grid grid-cols-12 gap-4 mt-4" >
        {
          tableData.length > 0 && <div className="col-span-12 text-center first-page" >
            <div>
              <h4 className='text-4xl pb-3'>Progress Report</h4>
            </div>
            <div>
              {fiscalYear && <p className='text-2xl'>({`01 July ${yearStart} - 30 June ${fullYearEnd}`})</p>}
            </div>
            <div>
              <h4 className='text-2xl font-bold pt-3 '>Planning Monitoring and Evaluation Section </h4>
              <p className='text-xl font-bold'>The Small and Medium Enterprise Foundation (SME Foundation) </p>
              <p className='text-lg font-bold'>
                {/* Parjatan Bhaban (Level-6&7), E-5/C-1, Agargaon Administrative Area, Dhaka - 1207, Bangladesh */}
                {stripHtmlTags(listQuery?.data?.header)} 
                
                
                <br />
                <span>
                  <a href="https://www.smef.gov.bd" target="_blank">www.smef.gov.bd</a>
                </span>
              </p>
              <p className='text-base font-bold'>
                <a href="" target="_blank" rel="noopener noreferrer">
                </a>
              </p>
            </div>
          </div>
        }
        <div className="col-span-12 table-content">
        {tableData.length > 0 && <ProgressReportGraph progressReportData={progressReportData} />}
        </div>
        <div className="col-span-12 table-content">
          <FinancialTable tableData={tableData} fiscalYear={fiscalYear} />
        </div>
        <div className="col-span-12 table-content">
          <BusinessSupport progressReportData={progressReportData} />
        </div>
        <div className="col-span-12 table-content">
          <div className="flex justify-center items-center">
            { tableData.length > 0 &&  stripHtmlTags(listQuery?.data?.footer) }
          </div>
        </div>
        {tableData.length < 0 && <EmptyData />}
      </div>
    </>
  )
}

export default ReportTable