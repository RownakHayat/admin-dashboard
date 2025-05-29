
import QRCodeComponent from "@/components/common/Form/FormQrcode";
import { Button } from "@/components/ui/button";
import { useGetSMEIdQrCodeQuery } from "@/store/features/eventManagement/attendance";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';


const QrAttendance = ({ id, open, setOpen }: any) => {


  const { data, error } = useGetSMEIdQrCodeQuery(id, {
    skip: id == null || id == undefined,
  });

  const componentRef = useRef(null);
  const handleClickToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "QR Attendance",
    onAfterPrint: () => console.log("Print Success"),
  })

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal >
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 " />
        <Dialog.Content className="bg-white rounded data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] rounded-[6px p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none flex flex-col justify-center items-center">

          <style>
            {`
              @media print {
                .print-container {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100vw;
                  height: 100vh;
                  margin: 0;
                  padding: 0;
                }
              }
            `}
          </style>

          <div className="print-container" ref={componentRef}>
            <QRCodeComponent value={data?.data?.url} size={200} />
          </div>
          <Button
            type="button"
            className=" bg-green-600 hover:bg-green-600 text-white font-bold py-4 px-10 rounded mt-10"
            onClick={() => handleClickToPrint()}
          >
            Print
          </Button>

          <Dialog.Close asChild>
            <button
              onClick={() => setOpen(!open)}
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[7px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default QrAttendance