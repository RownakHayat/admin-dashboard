import { FileCode2, UploadCloudIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/config/site";
import { useDropzone } from "react-dropzone";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  remark?: boolean;
}

type Props = {
  name: string;
} & InputFieldProps;

const FormFileUploadUpdated = (props: Props) => {
  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageDetails, setImageDetails] = useState<File | null>(null);
  const [imageType, setImageType] = useState<string>("");


  const imageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
              if (prevProgress < 100) {
                return prevProgress + 1;
              } else {
                clearInterval(interval);
                setUploadProgress(0);
                return prevProgress;
              }
            });
          }, 10);
        }
      };

      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onChangeFileUpload = async (files: File[]) => {
    if (!files?.length) return;
    const file = files[0];

    setImageType(file.type || "");
    const base64Img = await imageToBase64(file);
    setImageDetails(file);
    setValue(props.name, base64Img, { shouldValidate: true });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onChangeFileUpload,
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
    multiple: false,
  });

  const currentValue = watch(props.name);
  const showUploadBox = !currentValue;

  // helper to determine type based on value if fileType is missing
  const getFileType = (value: string): 'image' | 'pdf' | 'other' => {
    if (!value) return 'other';
    if (value.startsWith('data:image') || /\.(jpg|jpeg|png)$/i.test(value)) return 'image';
    if (value.startsWith('data:application/pdf') || /\.pdf$/i.test(value)) return 'pdf';
    return 'other';
  };

  const fileType = imageType
    ? (imageType.startsWith('image') ? 'image' : imageType.includes('pdf') ? 'pdf' : 'other')
    : getFileType(currentValue);

  const fileUrl = typeof currentValue === 'string' && currentValue.startsWith('data:')
    ? currentValue
    : `${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${currentValue}`;

  return (
    <div className="w-full">
      {props.label && (
        <div className="flex justify-between items-start mb-2">
          <Label className="text-[#4B5563]">
            {props.label}
            {props.remark && <span className="text-red-500 pl-1">*</span>}
          </Label>
        </div>
      )}

      <div className="relative pt-2">
        {showUploadBox ? (
          <div
            {...getRootProps()}
            className="py-10 bg-gray-50 w-full border border-[#9EAFFE] border-dashed text-black p-4 rounded-lg cursor-pointer flex flex-col items-center space-y-2 transition-all"
          >
            <UploadCloudIcon className="text-center" />
            <p className="text-sm text-center">
              <strong className="text-blue-500 font-bold">Click to upload</strong> or drag and drop
              <br /> JPG, JPEG, PNG, or PDF
            </p>
            <input {...getInputProps()} />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="bg-gray-50 w-full border border-[#9EAFFE] border-dashed text-black p-4 rounded-lg cursor-pointer overflow-hidden flex gap-6 transition-all"
          >
            <div className="w-full h-[450px] flex items-center justify-center bg-white rounded overflow-hidden">
              {fileType === "image" ? (
                <img
                  src={fileUrl}
                  alt="Uploaded"
                  className="w-full h-full object-contain"
                />
              ) : fileType === "pdf" ? (
                <div className="flex flex-col w-full">
                  <iframe
                    src={fileUrl}
                    className="w-full h-[400px] border-none"
                    title="Uploaded PDF"
                  />
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 inline-block"
                  >
                    Open PDF in new tab
                  </a>
                </div>
              ) : null}

            </div>

            {/* <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <p className="break-all">{imageDetails?.name || currentValue?.split('/')?.pop()}</p>
                  <small>{imageDetails ? prettyBytes(imageDetails.size) : ''}</small>
                </div>
                <Icons.delete
                  className="cursor-pointer"
                  onClick={() => {
                    setValue(props.name, "", { shouldValidate: true });
                    setImageDetails(null);
                    setImageType("");
                  }}
                />
              </div>
              {uploadProgress > 0 && (
                <Progress value={uploadProgress} className="w-full h-2 mt-2" />
              )}
            </div> */}
          </div>
        )}
        {(errors as Record<string, any>)?.[props.name]?.message && (
          <p className="text-sm font-medium text-destructive mt-1">
            {(errors as Record<string, any>)[props.name]?.message}
          </p>
        )}

      </div>
    </div>
  );
};

export default FormFileUploadUpdated;
