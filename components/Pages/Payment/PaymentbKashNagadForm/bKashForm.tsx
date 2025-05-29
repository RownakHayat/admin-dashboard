"use client"
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";
import { useCreateProgramMutation } from "@/store/features/eventManagement/newProgram";
import { closeFormToggle } from "@/store/zustand/formSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";


export const mobileSchema = z.object({
  mobile: z
  .string()
  .regex(/^01\d{9}$/, {
    message: "Mobile number must start with 01 and be exactly 11 digits.",
  }),
  // mobile: z.string().optional().nullable(),

});


const BKashForm = ({ onClose, onSubmitMobile }: { onClose: () => void, onSubmitMobile: (mobile: string) => void }) => {
  const [createProgram] = useCreateProgramMutation();
  const router = useRouter()

  const form = useForm<z.infer<typeof mobileSchema>>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof mobileSchema>> = async (values) => {
    try {
      onSubmitMobile(values.mobile || "");

      // onClose();
    } catch (error) {
    }
  };


  return (
      <div className="relative p-5 bg-white ">
        {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        aria-label="Close"
      >
        &times;
      </button>
        <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>

          <FormInput
            name="mobile"
            placeholder="Enter Mobile Number"
            label="Mobile"
            remark={true}
          />

            <div className="flex justify-center gap-5">
              <Button
                type="button"
                className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                onClick={() => {
                  closeFormToggle();
                  form.reset();
                }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
              >
                Payment
              </Button>
            </div>
        </FormContainer>

      </div>
  )
}

export default BKashForm