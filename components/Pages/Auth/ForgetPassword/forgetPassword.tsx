import FormInput from "@/components/common/Form/FormInput";
import useToast from "@/components/common/hooks/useToast";
import { Button } from "@/components/ui/button";
import { useForgetPasswordMutation } from "@/store/features/auth/Registration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ForgetNewMobileResetPasswordForm from "../ForgetNewPassword/forgetNewPassword";
import { forgetPasswordSchema } from "./schemas/forgetPasswordSchema";

type ForgetPasswordProps = {
  onBackToSignIn: () => void;
};

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ onBackToSignIn }) => {
  const { ToastSuccess, ToastError } = useToast();
  const [forgetPasswordChange] = useForgetPasswordMutation();
  const [showForgetPasswordComponent, setshowForgetPasswordComponent] =
    useState(false);
  const [responseData, setResponseData] = useState<any>(null);

  const forgetPasswordForm = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      mobile: "",
    },
  });
  const handleForgetPasswordSubmit: SubmitHandler<
    z.infer<typeof forgetPasswordSchema>
  > = async (values) => {
    try {
      const forgetPasswordChangeFn = forgetPasswordChange;
      const res = await forgetPasswordChangeFn({
        ...values,
      }).unwrap();

      if (res.code === 200) {
        forgetPasswordForm.reset();
        ToastSuccess("Forget Password Verify Successfully");
        setResponseData(res.data);
        setshowForgetPasswordComponent(true);
        // onClose();
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          forgetPasswordForm.setError(
            field as keyof z.infer<typeof forgetPasswordSchema>,
            {
              type: "custom",
              message,
            }
          )
      );
      ToastError("Forget Password Verification Failed");
    }
  };

  const handleBackToSignIn = () => {
    setshowForgetPasswordComponent(false); 
    onBackToSignIn();
  };




  return (
    <>
      {showForgetPasswordComponent ? (
        <ForgetNewMobileResetPasswordForm data={responseData} onBackToSignIn={handleBackToSignIn} />
      ) : (
        <FormProvider {...forgetPasswordForm}>
          <form
            onSubmit={forgetPasswordForm.handleSubmit(
              handleForgetPasswordSubmit
            )}
          >
            <h5>
              Enter your Phone Number, and we'll send you instructions to reset
              your password
            </h5>
            <div className="mt-3">
              <FormInput
                name="mobile"
                placeholder="Enter Mobile Number"
                label="Phone Number"
              />
            </div>

            <div className="flex justify-end gap-2 mt-3 my-3">
              <Button type="submit" className="bg-success w-full">
                Forget Password
              </Button>
            </div>
            <p className="text-xs text-nowrap my-3 text-center">
              <button type="button" className="text-primary underline font-bold ml-2" onClick={onBackToSignIn}>
                Back To Sign in
              </button>
            </p>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default ForgetPassword;
