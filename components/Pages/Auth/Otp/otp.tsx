import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import MaskedText from "@/components/common/Form/MaskedText";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useOtpRegistrationMutation, useOtpResendMutation } from "@/store/features/auth/Registration";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInForm from "../SignIn/signInForm";
import { OtpSchema } from "./schemas/otpSchema";
import LoginForm from "../LogIn/loginForm";

type OtpVerificationProps = {
  otp: string;
  mobile: string;
  time: number;
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  onOtpVerified: () => void;
  eventId:any
};

const OtpVerification: React.FC<OtpVerificationProps> = ({ otp: initialOtp, mobile, setIsRegistering, onOtpVerified, time, eventId }) => {
  const { ToastSuccess, ToastError } = useToast();
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [otp, setOtp] = useState(initialOtp);
  const [mobileOtpChange] = useOtpRegistrationMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useOtpResendMutation();

  const [remainingTime, setRemainingTime] = useState(time??170); // 170 seconds for OTP expiration

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      request_otp_code: "",
      mobile: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    if (remainingTime === 0) {
      // Handle OTP expiration logic here
      ToastError("OTP has expired. Please request a new one.");
      // Optionally disable the OTP input
    }

    return () => {
      if (timer) clearInterval(timer); // Cleanup timer on unmount
    };
  }, [remainingTime]);

  const handleOtpSubmit: SubmitHandler<z.infer<typeof OtpSchema>> = async (values) => {
    try {
      const res = await mobileOtpChange({
        ...values,
        mobile: mobile,
      }).unwrap();

      if (res.code === 200) {
        otpForm.reset();
        ToastSuccess("OTP Verified. Registration Success. Please log in.");
        setShowOtpInput(false);
        onOtpVerified();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
          otpForm.setError(field as keyof z.infer<typeof OtpSchema>, {
            type: "custom",
            message,
          })
      );
      ToastError("OTP Verification Failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await resendOtp({
        mobile: mobile,
      }).unwrap();

      if (res.code === 200) {
        setOtp(res.data.otp);
        setRemainingTime(170);
        ToastSuccess("OTP Resent Successfully");
      }
    } catch (err) {
      ToastError("Failed to resend OTP");
    }
  };

  useEffect(() => {
    otpForm.setValue("mobile", mobile);
    setOtp(initialOtp);
  }, [mobile, otpForm]);

  return (
      <div>
        {showOtpInput ? (
            <>
              <FormProvider {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
                  <h2 className="text-primary font-bold text-[20px]">Two-Step Verification</h2>
                  <p>We sent a verification code to your phone. Enter the code from the phone in the field below.</p>
                  <p>Mobile Number: <MaskedText text={mobile} /></p>

                  <div className="mt-3">
                    <h4>Type your 6 digit security code {otp}</h4>
                    <InputOTP maxLength={6} name="request_otp_code"
                              onChange={(value) => {
                                otpForm.setValue("request_otp_code", value);
                              }}
                              disabled={remainingTime === 0} // Disable if OTP expired
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index}/>
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="mt-3">
                  <p className="text-red-500">
                      OTP will expire in: {remainingTime > 0 ? `${remainingTime}s` : "Expired"}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 my-3">
                    <Button type="submit" className="bg-success w-full" disabled={remainingTime === 0}>
                      Verify OTP
                    </Button>
                  </div>
                </form>
              </FormProvider>

              <div className="mt-3 text-center">
                <p>
                  {isResendingOtp ? (
                      "Resending OTP..."
                  ) : (
                      <>
                        Didn't get the code?{' '}
                        <button
                            type="button"
                            className="text-blue-500 underline"
                            onClick={handleResendOtp}
                            disabled={isResendingOtp || remainingTime > 0}
                        >
                          Resend OTP
                        </button>
                      </>
                  )}
                </p>
              </div>
            </>
        ) : (
            // <SignInForm setIsRegistering={setIsRegistering} eventId={eventId}/>
            <LoginForm setIsRegistering={setIsRegistering}/>
        )}
      </div>
  );
};

export default OtpVerification;
