import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import FormInput from "@/components/common/Form/FormInput";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useEmailChangeMutation, useEmailOtpNumberMutation } from "@/store/features/UserManagement/emailChange";
import { useState } from "react";
import { ChangeEmailFormSchema, OtpSchema } from "./schemas/formSchema";


interface ChangeEmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof ChangeEmailFormSchema>) => void;
}

const ChangeEmailDialog: React.FC<ChangeEmailDialogProps> = ({ open, onClose, onSave }: any) => {

  const { ToastSuccess, ToastError } = useToast();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [emailChange] = useEmailChangeMutation();
  const [emailOtpChange] = useEmailOtpNumberMutation();

  const form = useForm<z.infer<typeof ChangeEmailFormSchema>>({
    resolver: zodResolver(ChangeEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitHandler: SubmitHandler<z.infer<typeof ChangeEmailFormSchema>> = async (values) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      form.setError("email", {
        type: "manual",
        message: "Invalid email address format.",
      });
      return;
    }

    try {
      const mutationFn = emailChange;
      const res = await mutationFn({
        ...values
      }).unwrap();

      if (res.code === 200) {
        form.reset();
        // ToastSuccess('Successfully');
        setOtpCode(res.data.otp);
        setShowOtpInput(true);
        otpForm.setValue("email", values.email);
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof ChangeEmailFormSchema>, {
          type: 'custom',
          message,
        })
      );
    }
  };

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp_code: "",
      email: "",
    },
  });

  const handleOtpSubmit: SubmitHandler<z.infer<typeof OtpSchema>> = async (values) => {
    const data = Number(values?.otp_code)
    try {
      const mutationOtpFn = emailOtpChange;
      const res = await mutationOtpFn({
        ...values
      }).unwrap();

      if (res.code === 200) {
        // form.reset();
        ToastSuccess('OTP Verify Successfully and wait for Approval');
        window.location.href = "/admin/user-dashboard/admin-profile/admin-profile-update";
        onClose();
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err.data.errors.forEach(({ field, message }: { field: string; message: string }) => {
          otpForm.setError(field as keyof z.infer<typeof OtpSchema>, {
            type: 'custom',
            message: message || 'Invalid OTP',
          });
        });
      } else {
        otpForm.setError("otp_code", {
          type: "custom",
          message: "Incorrect OTP. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Change Your Email</DialogTitle>
        <DialogDescription>
          Please enter your email to update.
        </DialogDescription>
        {!showOtpInput ? (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
              <FormInput type="email" name="email" label="New Email" />
              <div className="flex justify-end gap-2 mt-3">
                <Button type="button" onClick={onClose} className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-success p-5">
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        ) : (
          <FormProvider {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
              <p>Enter OTP sent to email:</p>
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
              <FormInput name="email" label="Email" />

              <div className="flex justify-end gap-2 mt-3">
                <Button type="button" onClick={() => setShowOtpInput(false)} className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-success p-5">
                  Verify OTP
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
