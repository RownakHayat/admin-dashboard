"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OtpVerification from "../Otp/otp";
import LoginForm from "./loginForm";
import { useEffect, useState } from "react";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";

type StepType = "register" | "otp";

type RegistrationFormProps = {
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
};

type OtpData = {
  otp: string;
  mobile: string;
  time: number;
};

const formLoginUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    mobile: z
      .string()
      .min(11, { message: "Mobile number must be at least 11 digits" })
      .regex(/^\d+$/, { message: "Mobile must be numeric" }),
    email: z
      .string()
      .min(3, { message: "Email must be at least 3 characters long." })
      .refine(
        (value) => /^\d+$/.test(value) || /\S+@\S+\.\S+/.test(value),
        { message: "Invalid email format or not a valid number." }
      ),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formLoginUpSchema>;

const LoginUpForm = ({ setIsRegistering }: RegistrationFormProps) => {
  const [step, setStep] = useState<StepType>("register");
  const [otpData, setOtpData] = useState<OtpData | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
   const [showLogin, setShowLogin] = useState(false);

    const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formLoginUpSchema),
  });


 const registerForm = useForm<FormData>({
  resolver: zodResolver(formLoginUpSchema),
  defaultValues: {
      name: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
});



  useEffect(() => {
    const savedMobile = localStorage.getItem("rememberMeMobile");
    const savedPassword = localStorage.getItem("rememberMePassword");

    if (savedMobile && savedPassword) {
      setValue("mobile", savedMobile);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmitLogin = (data: FormData) => {
    registerForm.reset();
    console.log("Registration Data:", data);

    // Normally you'd call backend to send OTP
    // setOtpData({ otp: "123456", mobile: data.mobile, time: Date.now() });
    // setStep("otp");
  };

//   if (step === "otp" && otpData) {
//     return (
//       <OtpVerification
//         mobile={otpData.mobile}
//         setStep={setStep}
//         setIsRegistering={setIsRegistering}
//       />
//     );
//   }

  return (
     <>
     {!showLogin ? (
       <>
         <h5 className="text-primary font-bold text-[20px] mb-3">Sign Up</h5>
        <FormContainer form={registerForm} onSubmit={registerForm.handleSubmit(onSubmitLogin)} autoComplete="off">
      <div>
        <FormInput
        label="User name"
          placeholder="Name"
          {...register("name")}
          className="input"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <FormInput
        label="Mobile"
          placeholder="Mobile"
          {...register("mobile")}
          className="input"
        />
        {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
      </div>

      <div>
        <FormInput
        label="Email"
          placeholder="Email"
          {...register("email")}
          className="input"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <FormInput
        label="Password"
          type="password"
          placeholder="Password"
          {...register("password")}
          className="input"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <FormInput
        label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className="input"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        onClick={() => setIsRegistering(false)}
        className="text-white bg-[#0CB04D] hover:bg-primary focus:ring-4 w-[100%] md:w-[100%] lg:w-[100%] focus:outline-none font-medium rounded text-sm  py-1 text-center"
        >
        Register
      </Button>

      <p className="text-sm text-center mt-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setIsRegistering(false)}
          className="text-blue-500 hover:underline"
        >
          Login
        </button>
      </p>
    </FormContainer>
       </>
     ) : (
        <LoginForm setIsRegistering={setIsRegistering} />
     )
     }
     
    </>
  );
};

export default LoginUpForm;