'use client';

import { Button } from '@/components/ui/button';
import { useCreateSmeIdMutation } from '@/store/features/eventManagement/attendance';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React, { useRef, useState } from 'react';

interface ExcelFileUploadProps {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExcelFileUpload: React.FC<ExcelFileUploadProps> = ({ id, open, setOpen }) => {
  const [csvfile, setCsvfile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



  const handleDownload = () => {
    const filePath = '/assets/File/CSVFileForAttendance.csv'; // Correct path relative to the public directory
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'CSVFileForAttendance.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCsvfile(event.target.files[0]);
    }
  };

  const importCSV = async () => {
    if (!csvfile) {
      alert('Please select a CSV file to upload');
      return;
    }

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', csvfile);    // Append the CSV file
    formData.append('sme_id', id);       // Add any necessary data (for example, sme_id)
    formData.append('event_id', id);     // Add any necessary data (for example, event_id)
    const [uploadSMEFile] = useCreateSmeIdMutation();
    try {
      // Send FormData to the mutation or server endpoint
      const response = await uploadSMEFile(formData); // Assuming uploadSMEFile works with FormData
    } catch (error) {
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="bg-white  data-[state=open]:animate-contentShow overflow-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <h1 className="text-4xl text-center font-medium">Upload Files</h1>

          <div className="text-end">
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
              onClick={handleDownload}
            >
              Download CSV
            </Button>
          </div>

          <div className="">
            <h2>Import CSV File!</h2>
            <input
              className="csv-input"
              type="file"
              ref={fileInputRef}
              name="csv"
              placeholder="Import CSV File"
              onChange={handleChange}
            />
            <p />
            <Button
              className="bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
              onClick={importCSV}
            >
              Import
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              onClick={() => setOpen(false)}
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExcelFileUpload;
