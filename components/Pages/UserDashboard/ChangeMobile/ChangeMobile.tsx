import FormInput from "@/components/common/Form/FormInput";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useMobilePhoneNumberChangeMutation, useMobilePhoneOtpNumberMutation } from "@/store/features/UserManagement/mobileChange";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { ChangeMobileNumberFormSchema, OtpSchema } from "./schemas/formSchema";

interface ChangePhoneNumberDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof ChangeMobileNumberFormSchema>) => void;
  oldPhoneNumber: string,
}

const ChangePhoneNumberDialog: React.FC<ChangePhoneNumberDialogProps> = ({ open, onClose, onSave, oldPhoneNumber }) => {
  const { ToastSuccess, ToastError } = useToast();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isResendingOtp, setIsResendingOtp] = useState(false); // State for resending OTP
  const [mobileNumberChange] = useMobilePhoneNumberChangeMutation();
  const [mobileOtpChange] = useMobilePhoneOtpNumberMutation();

  // const [remainingTime, setRemainingTime] = useState(170);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const form = useForm<z.infer<typeof ChangeMobileNumberFormSchema>>({
    resolver: zodResolver(ChangeMobileNumberFormSchema),
    defaultValues: {
      old_mobile_number: "",
      new_mobile_number: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    if (remainingTime === 0 && timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer); // Cleanup on unmount
    };
  }, [remainingTime, timerActive]);

  const onSubmitHandler: SubmitHandler<z.infer<typeof ChangeMobileNumberFormSchema>> = async (values) => {

    try {
      const res = await mobileNumberChange({ ...values }).unwrap();

      if (res.code === 200) {
        form.reset();
        setOtpCode(res.data.otp);
        setShowOtpInput(true);
        setRemainingTime(res?.data?.otp_time_in_secdd || 170);
        setTimerActive(true);
        // setRemainingTime(170);
        otpForm.setValue("old_mobile", values.old_mobile_number);
        otpForm.setValue("new_mobile", values.new_mobile_number);
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof ChangeMobileNumberFormSchema>, {
          type: 'custom',
          message,
        })
      );
    }
  };

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      request_otp_code: "",
      old_mobile: "",
      new_mobile: "",
    },
  });

  const handleOtpSubmit: SubmitHandler<z.infer<typeof OtpSchema>> = async (values) => {
    try {
      const res = await mobileOtpChange({ ...values }).unwrap();

      if (res.code === 200) {
        // Reset forms and modal states
        form.reset();
        otpForm.reset();
        setShowOtpInput(false);
        setOtpCode('');
        onSave({ old_mobile_number: values.old_mobile, new_mobile_number: values.new_mobile });
        // ToastSuccess('Change Phone Number Successfully');
        // window.location.href = "/admin/user-dashboard/admin-profile/admin-profile-update";
        Swal.fire({
          title: "Success!",
          text: "Changed Phone Number Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          window.location.href = "/admin/user-dashboard/admin-profile/admin-profile-update";
        });
        onClose(); // Close the modal
      }
    } catch (err: any) {
      ToastError("Failed to verify OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true); // Set resending state
      // Logic to resend OTP
      const res = await mobileNumberChange({
        old_mobile_number: otpForm.getValues("old_mobile"),
        new_mobile_number: otpForm.getValues("new_mobile"),
      }).unwrap();

      if (res.code === 200) {
        setOtpCode(res.data.otp);
        setRemainingTime(170); // Restart timer
        ToastSuccess("OTP resent successfully");
      }
    } catch (err) {
      ToastError("Failed to resend OTP");
    } finally {
      setIsResendingOtp(false); // Reset resending state
    }
  };

  useEffect(() => {
    if (open) {
      form.setValue("old_mobile_number", oldPhoneNumber); // Set old phone number when modal opens
    }
  }, [open, oldPhoneNumber, form]);


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild />
      <DialogContent>
        <DialogTitle>Change Your Phone Number</DialogTitle>
        <DialogDescription>
          Please enter your old and new phone numbers to update.
        </DialogDescription>
        {!showOtpInput ? (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
              <FormInput name="old_mobile_number" label="Old Phone Number" disabled />
              <FormInput name="new_mobile_number" label="New Phone Number" />
              <div className="flex justify-end gap-2 mt-3">
                <Button type="button" onClick={onClose} className="bg-warning hover:bg-warning">
                  Cancel
                </Button>
                <Button type="submit" className="bg-success">
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        ) : (
          <FormProvider {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
              <p className="gap-3">
                Enter OTP sent to your mobile number: <span>{otpCode}</span>
              </p>
              <InputOTP maxLength={6} name="request_otp_code"
                onChange={(value) => otpForm.setValue("request_otp_code", value)}
                disabled={remainingTime === 0} // Disable OTP input if time expires
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <p className="text-red-500">
                OTP will expire in: {remainingTime > 0 ? `${remainingTime}s` : "Expired"}
              </p>

              <FormInput name="old_mobile" label="Old Phone Number" disabled />
              <FormInput name="new_mobile" label="New Phone Number" disabled />

              {/* Resend OTP Section */}
              <div className="mt-3 text-center">
                <p>
                  {isResendingOtp ? (
                    "Resending OTP..."
                  ) : (
                    <>
                      Didn't get the code?{" "}
                      <button
                        type="button"
                        className="text-blue-500 underline"
                        onClick={handleResendOtp}
                        disabled={isResendingOtp || remainingTime > 0} // Disable if resending or timer is still counting down
                      >
                        Resend OTP
                      </button>
                    </>
                  )}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Button type="button" onClick={() => setShowOtpInput(false)} className="bg-warning hover:bg-warning">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2b7d74] hover:bg-[#2b7d74]" disabled={remainingTime === 0}>
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

export default ChangePhoneNumberDialog;
