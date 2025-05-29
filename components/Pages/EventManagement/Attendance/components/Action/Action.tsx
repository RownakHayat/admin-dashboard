
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";
import QrAttendance from "../QrAttendance/QrAttendance";
import SmeId from "../SmeId/SmeId";
import ExcelFileUpload from "../UploadExcel/ExcelFileUpload";

const Action = ({ id, rowData, open, setOpen, refetch, actionPosition }: any) => {

  const [showSmeIdModal, setShowSmeIdModal] = useState(false)
  const [showQrAttendModal, setShowQrAttendModal] = useState(false)
  const [showUploadExcelModal, setShowUploadExcelModal] = useState(false)
  

  return (
    <>
      <Dialog.Root open={open && rowData} onOpenChange={setOpen}>
        <Dialog.Portal >
        <Dialog.Overlay className="bg-blackA6 fixed inset-0" />
          {/* <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" /> */}
          <Dialog.Content
            className="bg-white rounded absolute max-h-[85vh] w-[200px] p-3 shadow-lg transform transition-all -translate-y-2/1 lg:left-auto top-auto" 
            style={{
              top: `${actionPosition?.top - 175}px`, // Adjusted for slight offset below button
              left: `${actionPosition?.left - 105 }px`,
            }}
          >
            {/* <Dialog.Content className="bg-white rounded data-[state=open]:animate-contentShow overflow-auto fixed top-[27%] right-[2%] max-h-[85vh]  rounded-[6px p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"> */}
            <div className="flex my-2 cursor-pointer"
              onClick={() => {
                setShowSmeIdModal(true)
                setOpen(!open)
              }} >
              <span className="mr-3"><Image src="/assets/Image/userIcon.png" alt="Reload" width={22} height={22} /></span>
              <span> User Id</span>
            </div>

            <div className="flex my-2 cursor-pointer"
              onClick={() => {
                setShowQrAttendModal(true)
                setOpen(!open)
              }}>
              <span className="mr-3"><Image src="/assets/Image/barcode.png" alt="Reload" width={20} height={20} /></span>
              <span> QR Attendance</span>
            </div>

            <div className="flex my-2 cursor-pointer"
              onClick={() => {
                setShowUploadExcelModal(true)
                setOpen(!open)
              }}>
              <span className="mr-3"><Image src="/assets/Image/excel.png" alt="Reload" width={20} height={20} /></span>
              <span> Upload Excel</span>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <SmeId open={showSmeIdModal} setOpen={setShowSmeIdModal} id={rowData?.id} refetch={refetch}/>
      <QrAttendance open={showQrAttendModal} setOpen={setShowQrAttendModal} id={rowData?.id} />
      {/* <UploadExcel open={showUploadExcelModal} setOpen={setShowUploadExcelModal} id={rowData?.id} /> */}
      <ExcelFileUpload open={showUploadExcelModal} setOpen={setShowUploadExcelModal} id={id} key={rowData?.id} refetch={refetch} />
    </>
  )
}

export default Action