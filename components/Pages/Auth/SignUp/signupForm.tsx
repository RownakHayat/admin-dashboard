import { FormAutoCompleteSignup } from "@/components/common/Form/FormAutoCompleteSignup";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInputPassword from "@/components/common/Form/FormInputPassword";
import FormInputSignup from "@/components/common/Form/FormInputSignup";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import { useRegistrationMutation } from "@/store/features/auth/Registration";
import { useGetAllGenderQuery } from "@/store/features/configuration/gender";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import OtpVerification from "../Otp/otp";
import SignInForm from "../SignIn/signInForm";
import { signUpSchema } from "./schemas/signUpSchema";

type RegistrationFormProps = {
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  eventId:any
};
type OtpData = {
  otp: string;
  mobile: string;
  time: number;
};
const SignUpForm: React.FC<RegistrationFormProps> = ({ setIsRegistering, eventId }) => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpData, setOtpData] = useState<OtpData>(
    {
      otp: "",
      mobile: "",
      time: 0,
    }
  );
  const [showLogin, setShowLogin] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { data: allGender } = useGetAllGenderQuery();
  const [signUp] = useRegistrationMutation();

  const registerForm = useForm<z.infer<typeof signUpSchema>>({
    mode: "all",
    reValidateMode: "onSubmit",
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      gender_id: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  const onSubmitRegister: SubmitHandler<z.infer<typeof signUpSchema>> = async (values) => {
    try {
      const mutationFn = signUp;
      const res = await mutationFn({ ...values }).unwrap();

      if (res.code === 200) {
        setOtpData({ otp: res.data.otp, mobile: res.data.mobile, time: res.data.time });
        registerForm.reset();
        setShowOtpInput(true);
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(
        ({ field, message }: { field: string; message: string }) =>
          registerForm.setError(field as keyof z.infer<typeof signUpSchema>, {
            type: "custom",
            message,
          })
      );
    }
  };

  return (
    <>
      {!showOtpInput && !showLogin ? (
        <FormContainer form={registerForm} onSubmit={registerForm.handleSubmit(onSubmitRegister)}>
          <h5 className="text-primary font-bold text-[20px]">Sign Up</h5>
          <div className="w-full">
            <div className="mt-2">
              <FormInputSignup
                name="name"
                placeholder="Enter Name"
                label=""
                remark={true}
              />
            </div>
            <div className="mt-2">
              <FormAutoCompleteSignup
                name="gender_id"
                data={listArrayDaynamicModify(allGender?.data, "gender", "name")}
                singleListName="gender"
                label=""
                placeholder="Select Gender"
                remark={true}
              />
            </div>
            <div className="mt-2">
              <FormInputSignup
                name="mobile"
                placeholder="Enter Mobile Number"
                label=""
                remark={true}
              />
            </div>
            <div className="mt-2 relative">
              <FormInputPassword
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter Password"
                label=""
                remark={true}
              />
            </div>

            <div className="mt-2 relative">
              <FormInputPassword
                name="confirmPassword"
                placeholder="Confirm Password"
                label=""
                remark={true}
              />
            </div>

            <div className="text-center mt-3 w-full">
              <Button
                type="submit"
                className="text-white bg-[#2B51B2] hover:bg-[#0CB04D] focus:ring-4 focus:outline-none font-medium rounded text-sm w-full px-12 py-1 text-center"
              >
               Create an account
              </Button>
              <p className="text-wrap my-3">
                Already have an account?
                <span>
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-primary   ml-2"
                  >
                    Sign in
                  </button>
                </span>
              </p>
              <p className="text-[14px] text-red-600 font-bold">
                এসএমইএফ সেবা গ্রহণের জন্য Create an account করার পর প্রোফাইল পূর্ণ করার
                জন্য অনুরোধ করা হলো এবং ইউজার আইডি টি ভবিষ্যৎ কার্যার্থে সংরক্ষণ করুন।
              </p>
            </div>
          </div>
        </FormContainer>
      ) : showOtpInput ? (
        <>
          <OtpVerification
            otp={otpData.otp}
            mobile={otpData.mobile}
            time={otpData.time}
            setIsRegistering={setIsRegistering}
            onOtpVerified={() => setShowOtpInput(true)}
            eventId={eventId}
          />
        </>
      ) : (
        <SignInForm setIsRegistering={setIsRegistering} eventId={null}/>
      )}
    </>
  );
};

export default SignUpForm;
