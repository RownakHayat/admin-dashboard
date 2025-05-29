import FormInput from "@/components/common/Form/FormInput";
import MaskedText from "@/components/common/Form/MaskedText";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useForgetPasswordMutation, useResetPasswordInfoMutation } from "@/store/features/auth/Registration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ResetPasswordSchema } from "./schemas/forgetResetPasswordSchema";
import FormChangePassword from "@/components/common/Form/FormChangePassword";

interface ForgetNewMobileResetPasswordFormProps {
  data: {
    otp: string;
    mobile: string;
    otp_time_in_sec: number;
  };
  onBackToSignIn: () => void;
}

const ForgetNewMobileResetPasswordForm: React.FC<ForgetNewMobileResetPasswordFormProps> = ({ data, onBackToSignIn }) => {
  const { ToastSuccess, ToastError } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [forgetNewPasswordChange] = useResetPasswordInfoMutation();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ''));
  const [otpMatchError, setOtpMatchError] = useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);

  const forgetNewPasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      request_otp_code: "",
      mobile: data?.mobile || "",
      password: "",
      confirm_password: ""
    },
  });

  const handleForgetNewPasswordSubmit: SubmitHandler<z.infer<typeof ResetPasswordSchema>> = async (values) => {
    try {
      if (values.password !== values.confirm_password) {
        setPasswordMatchError(true);
        return;
      }
      const res = await forgetNewPasswordChange({ ...values }).unwrap();

      if (res.code === 200) {
        forgetNewPasswordForm.reset();
        ToastSuccess("Password Reset Successfully");
        onBackToSignIn();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          forgetNewPasswordForm.setError(field as keyof z.infer<typeof ResetPasswordSchema>, {
            type: "custom",
            message,
          })
      );
      ToastError("Password Reset Failed");
    }
  };

  const [forgetPasswordChange] = useForgetPasswordMutation();
  const [resetOtpData, setResetOtpData] = useState( data?.otp)
  const [resetOtpTime, setResetOtpTime] = useState(data?.otp_time_in_sec)
  
  const [isOtpResendEnabled, setIsOtpResendEnabled] = useState(false);

  
  const handleResetOtpBtn = async () => {
    try {
      const forgetPasswordChangeFn = forgetPasswordChange;
      const res = await forgetPasswordChangeFn({
        mobile: data?.mobile || ""
      }).unwrap();

      if (res.code === 200) {
        setResetOtpData(res?.data?.otp)
        setResetOtpTime(res?.data?.otp_time_in_sec)
        setIsOtpResendEnabled(false);
        ToastSuccess("Resend OTP Successfully");
      }
    } catch (err: any) {
      ToastError("Resend OTP Failed");
    }

  }
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (resetOtpTime > 0) {
      timer = setInterval(() => {
        setResetOtpTime((prevTime) => {
          if (prevTime <= 1) {
            setIsOtpResendEnabled(true); // Enable resend button when time reaches 0
            clearInterval(timer!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer); // Cleanup the timer
    };
  }, [resetOtpTime]);


  useEffect(() => {
    if (data) {
      setOtpDigits(data?.otp?.split('').slice(0, 6));
      forgetNewPasswordForm.setValue("request_otp_code", data?.otp?.slice(0, 6));
      forgetNewPasswordForm.setValue("mobile", data?.mobile || "");
    }
  }, [data, forgetNewPasswordForm]);

  const handleOTPInputChange = (index: number, value: string) => {
    const updatedOTP = [...otpDigits];
    updatedOTP[index] = value;
    setOtpDigits(updatedOTP);
    forgetNewPasswordForm.setValue("request_otp_code", updatedOTP.join(''));
  };

  return (
    <div>
      <div>
        {data ? (
          <div>
            <h5>
              We sent a verification code to your phone.
              Enter the code from the phone in the field below.
              Mobile Number <MaskedText text={data?.mobile} />
            </h5>
            {/* <p>OTP: {data?.otp}</p> */}
            <p>OTP: { resetOtpData}</p>
           
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <FormProvider {...forgetNewPasswordForm}>
        <form onSubmit={forgetNewPasswordForm.handleSubmit(handleForgetNewPasswordSubmit)}>
          <div className="mt-3">
            <InputOTP maxLength={6} name="request_otp_code"
              onChange={(value) => {
                forgetNewPasswordForm.setValue("request_otp_code", value);
              }}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_: any, index: number) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {otpMatchError && <p className="text-red-500">OTP does not match</p>}
          </div>
          <div className="mt-3">
            <FormInput
              name="mobile"
              placeholder="Enter Mobile Number"
              label="Phone Number" disabled
            />
            <div className="flex justify-between pt-2">
              <div>
                <p className="text-sm font-light">Waiting for OTP: <span className="text-red-600 font-medium"> {resetOtpTime}</span> s</p>
              </div>
              <div>
                <button
                  type="button"
                  className={`text-primary font-medium text-sm ml-2 ${!isOtpResendEnabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={handleResetOtpBtn}
                  disabled={!isOtpResendEnabled}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            {/* <FormInput
                  name="password"
                  placeholder="Enter Password"
                  label="New Password"
                  type="password"
              /> */}
            <FormChangePassword
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter Password"
              label="Enter Password"
              remark={true}
            />
          </div>
          <div className="mt-3">
            {/* <FormInput
                  name="confirm_password"
                  placeholder="Enter Confirm password"
                  label="Confirm password"
                  type="password"
              /> */}
            <FormChangePassword
              name="confirm_password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter Confirm New"
              label="Confirm New password"
              remark={true}
            />
          </div>
          {passwordMatchError && <p className="text-red-500">Passwords do not match.</p>}

          <div className="flex justify-end gap-2 my-3">
            <Button type="submit" className="bg-success w-full">
              Reset Password
            </Button>
          </div>
          <p className="text-xs text-nowrap my-3 text-center">
            <button type="button" className="text-primary underline font-bold ml-2" onClick={onBackToSignIn}>
              Back To Sign in
            </button>
          </p>
        </form>
      </FormProvider>
    </div>
  );
};

export default ForgetNewMobileResetPasswordForm;
