import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import FormInput from "@/components/common/Form/FormInput";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useEmailOtpNumberMutation } from "@/store/features/UserManagement/emailChange";
import { useEffect } from "react";
import { OtpSchema } from "./schemas/formSchema";


interface EmailOtpProps {
  open: boolean;
  onClose: () => void;
  verifiedEmail: string;
}
const EmailOtp: React.FC<EmailOtpProps> = ({ open, onClose, verifiedEmail }) => {

  const { ToastSuccess, ToastError } = useToast();
  const [emailOtpChange] = useEmailOtpNumberMutation();

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp_code: "",
      email: verifiedEmail,
    },
  });

  const handleOtpSubmit = async (values: z.infer<typeof OtpSchema>) => {
    try {
      const res = await emailOtpChange({
        ...values
      }).unwrap();

      if (res.code === 200) {
        otpForm.reset();
        ToastSuccess('OTP Verify Successfully and wait for Approval');
        onClose();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        otpForm.setError(field as keyof z.infer<typeof OtpSchema>, {
          type: 'custom',
          message,
        })
      );
    }

  };
  useEffect(() => {
    otpForm.setValue("email", verifiedEmail);
  }, [verifiedEmail, otpForm]);


  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Email Verify</DialogTitle>
          {/* <DialogDescription>
            Please enter your email Verify.
          </DialogDescription> */}

          <FormProvider {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
              <FormInput name="email" label="Email" disabled />
              <p>Enter the OTP sent to verify the email:</p>
              <InputOTP maxLength={6} name="otp_code"
                onChange={(value) => {
                  otpForm.setValue("otp_code", value);
                }}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_: any, index: number) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {otpForm.formState.errors.otp_code && (
                <p className="text-red-500 pt-2 pb-2">{otpForm.formState.errors.otp_code.message}</p>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" className="bg-red-500" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-success">
                  Verify OTP
                </Button>
              </div>
            </form>
          </FormProvider>

        </DialogContent>
      </Dialog>

    </>
  )
}

export default EmailOtp