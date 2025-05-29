import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  useCreateSmeIdMutation,
  useGetSMEIdQuery,
} from "@/store/features/eventManagement/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

export const smeIdMobile = z.object({});

const SmeId = ({ id, open, setOpen, refetch }: any) => {
  const form = useForm<z.infer<typeof smeIdMobile>>({
    resolver: zodResolver(smeIdMobile),
    defaultValues: {
      event_id: "",
      sme_id: "",
    },
  });

  const [mobile, setMobile] = useState("");
  const [smeData, setSmeData] = useState<any>(null);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [openDialog, setOpenDialog] = useState(false);

  const { data, error } = useGetSMEIdQuery(mobile, {
    skip: mobile.length !== 11,
  });

  const handleChange = (e: any) => {
    setMobile(e.target.value);
  };

  useEffect(() => {
    if (mobile.length === 11 && data) {
      setSmeData(data);
      const smeId = data?.data?.user_profile?.sme_id || "";
      const smeIdArray = smeId.split("").slice(0, 6);
      setOtpValues(smeIdArray);
    }
  }, [data, mobile]);

  const [createSMEId] = useCreateSmeIdMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const onSubmitHandler = async (values: any) => {
  //     try {
  //         createSMEId({
  //             ...values,
  //             event_id: id,
  //             sme_id: smeData?.data?.user_profile?.sme_id,
  //
  //         }).unwrap()
  //             .then((res: any) => {
  //                 if (res.code === 200) {
  //                     form.reset();
  //                     setOpenDialog(!openDialog)
  //                     setOpen(!open)
  //                 }
  //             })
  //             .catch((err: any) => {
  //
  //             })
  //     } catch (err: any) { }
  // };

  const onSubmitHandler = async (values: any) => {
    try {
      setErrorMessage(null);
      await createSMEId({
        ...values,
        event_id: id,
        sme_id: smeData?.data?.user_profile?.sme_id,
      })
        .unwrap()
        .then((res: any) => {
          if (res.code === 200) {
            form.reset();
            setOpenDialog(!openDialog);
            setOpen(!open);
            refetch();
            Swal.fire({
              title: "Success!",
              text: "Attendance Updated Successfully",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#0b9e45",
            });
          }
        })
        .catch((err: any) => {
          console.error("Error Response:", err);

          // Check if it's a 403 error and try extracting the message properly
          if (err?.status === 403) {
            const errorMsg =
              err?.data?.[0]?.message ||
              err?.data?.message ||
              err?.data?.errors?.[0]?.message ||
              "An error occurred";
            setErrorMessage(errorMsg);
          } else {
            setErrorMessage("Unexpected error occurred");
          }
        });
    } catch (err: any) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 " />
        <Dialog.Content
          className="bg-white rounded data-[state=open]:animate-contentShow
                overflow-auto fixed top-[50%] left-[50%] max-h-[85vh]
                 xs:max-w-[450px] translate-x-[-50%]
                translate-y-[-50%] rounded-[6px p-[25px]
                shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        >
          <div className="grid place-items-center">
            <Image
              src="/assets/Image/userIcon.png"
              alt="Reload"
              width={70}
              height={70}
            />
            <p className="mt-8">Enter your User Id</p>

            <FormContainer
              form={form}
              onSubmit={form.handleSubmit(onSubmitHandler)}
            >
              <div className="w-full mt-5 relative">
                <p className="absolute bottom-2 bg-green-400 z-50">
                  <Icons.search className="absolute top-[-25px] left-[5px] text-gray-400" />
                </p>
                <FormInput
                  name="mobile"
                  onChange={handleChange}
                  className="bg-white w-full rounded focus-visible:bg-white focus-visible:outline-[#Gray-sd-1] smeIDPlaceHolder border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-400"
                  placeholder="Enter Your Mobile Number"
                  autoComplete="off"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              <div className="flex space-x-2 mt-5">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    value={
                      mobile.length === 11 && error
                        ? ""
                        : mobile.length === 11 && data
                        ? value
                        : ""
                    }
                    readOnly
                    className="w-9 h-9 text-center border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600 text-lg"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className=" bg-green-600 hover:bg-green-600 text-white font-bold py-2 mt-5 px-4 rounded"
                >
                  Submit
                </Button>
              </div>
            </FormContainer>
          </div>

          <Dialog.Close asChild>
            <button
              onClick={() => setOpen(!open)}
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

export default SmeId;
