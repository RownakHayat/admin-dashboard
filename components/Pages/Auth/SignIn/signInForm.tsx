import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";
import { addAuthInformation, useLoginMutation } from "@/store/features/auth";
import { useAppDispatch } from "@/store/useReduxStore";
import useAuthStore from "@/store/zustand/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ForgetPassword from "../ForgetPassword/forgetPassword";
import { signInSchema } from "./schemas/signInSchema";

type LoginFormProps = {
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  eventId: any;
};

const SignInForm: React.FC<LoginFormProps> = ({
  setIsRegistering,
  eventId,
}) => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [login] = useLoginMutation();

  const loginForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedMobile = localStorage.getItem("rememberMeMobile");
    const savedPassword = localStorage.getItem("rememberMePassword");

    if (savedMobile && savedPassword) {
      loginForm.setValue("mobile", savedMobile);
      loginForm.setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [loginForm]);

  const onSubmitLogin: SubmitHandler<z.infer<typeof signInSchema>> = async (
    values
  ) => {
    try {
      const res = await login({ ...values }).unwrap();
      if (res.code === 200) {
        const user = res?.data;
        setUser(user);
        dispatch(addAuthInformation(user));
        Cookies.set("token", user?.token);

        if (Cookies.get("token")) {
          // eventId == null ? router.push("/admin") : window.location.href = `/admin/events/new-event-apply/${eventId}/apply-event`;
          eventId == null
            ? (window.location.href = `/admin`)
            : (window.location.href = `/admin/events/new-event-apply/${eventId}/apply-event`);
        }

        if (rememberMe) {
          localStorage.setItem("rememberMeMobile", values.mobile);
          localStorage.setItem("rememberMePassword", values.password);
        } else {
          localStorage.removeItem("rememberMeMobile");
          localStorage.removeItem("rememberMePassword");
        }
        loginForm.reset();
      }
    } catch (err: any) {
      const errorList: string[] = [];

      // if (err?.data?.errors) {
      //   // Field-specific errors from the server
      //   err.data.errors.forEach(
      //     ({ field, message }: { field: string; message: string }) => {
      //       loginForm.setError(field as keyof z.infer<typeof signInSchema>, {
      //         type: "custom",
      //         message,
      //       });
      //       errorList.push(message);
      //     }
      //   );
      // } else {
      //   errorList.push("Login Failed, Please Try Again");
      // }

      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        err.data.errors.forEach(
          ({ field, message }: { field: string; message: string[] }) => {
            const joinedMessage = message.join(" ");

            // Check if the field exists in the form schema
            if (field in signInSchema.shape) {
              loginForm.setError(field as keyof z.infer<typeof signInSchema>, {
                type: "custom",
                message: joinedMessage,
              });
            } else {
              // If the field is not part of the form, treat it as a global error
              errorList.push(joinedMessage);
            }
          }
        );
      } else {
        errorList.push("Login Failed, Please Try Again");
      }

      setErrorMessages(errorList);
    }
  };
  const handleForgetPassword = async () => {
    setShowForgetPassword(true);
  };
  const handleBackToSignIn = () => {
    setShowForgetPassword(false);
  };

  if (showForgetPassword) {
    return <ForgetPassword onBackToSignIn={handleBackToSignIn} />;
  }

  return (
    <>
      <h5 className="text-primary font-bold text-[20px] mb-3">Sign In</h5>

      <FormContainer
        form={loginForm}
        onSubmit={onSubmitLogin}
        autoComplete="off"
      >
        <div className="w-full ">
          <FormInput
            name="mobile"
            label="Mobile"
            className="bg-white w-full rounded focus-visible:bg-white focus-visible:outline-[#Gray-sd-1] border border-[#Gray-sd-1]"
            placeholder="Enter Your Mobile Number"
            // autoComplete="off"
          />
          <div className="flex justify-between relative mt-3">
            <FormInput
              type={isPasswordVisible ? "password" : "text"}
              name="password"
              label="Password"
              className="bg-white w-full border rounded focus-visible:bg-white focus-visible:outline-[#Gray-sd-1] border-[#Gray-sd-1]"
              placeholder="Enter Your Password"
              // autoComplete="off"
            />
            <span
              className="cursor-pointer p-3 absolute top-7 right-2"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {errorMessages.length > 0 && (
            <div className="text-red-500 text-sm mb-2 mt-2">
              {errorMessages.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-3">
            <div className="">
              <div className="flex items-center ">
                <div className="flex items-center h-6">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  />
                </div>
                <label className="ms-2 text-[12px] text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>
            </div>
            <div className="">
              <div className="flex items-end">
                <button
                  type="button"
                  className="text-primary text-[12px] underline"
                  onClick={handleForgetPassword}
                >
                  Forgot Password
                </button>
              </div>
            </div>
          </div>
          {/* {errorMessages?.length > 0 && (
            <div className="mb-4 text-red-500">
              {errorMessages?.map((msg: string, index: number) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
          )} */}

          <div className="grid grid-cols-12 rounded-lg gap-3 mt-3">
            <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-6">
              <div className="md:text-center lg:text-center xl:text-start">
                <Button
                  type="submit"
                  className="text-white bg-[#0CB04D] hover:bg-primary focus:ring-4 w-[100%] md:w-[100%] lg:w-[100%] focus:outline-none font-medium rounded text-sm  py-1 text-center"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-6">
              <div className="text-end md:text-center lg:text-center xl:text-end">
                <Button
                  onClick={() => setIsRegistering(true)}
                  className="text-white bg-[#2b51b2] hover:bg-[#2b51b2] focus:ring-4 w-[100%] md:w-[100%] lg:w-[100%] focus:outline-none font-medium rounded text-sm text-wrap px-[2%] py-1 text-center"
                >
                  Create an account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FormContainer>

      <p className="text-sm text-red-600 pt-5 font-bold text-wrap w-full">
        এসএমই ফাউন্ডেশনের সেবা গ্রহণের জন্য ‘Create an account’ এর মাধ্যমে
        অন্তর্ভুক্ত হবার জন্য আপনাকে অনুরোধ করা হলো। ইতিমধ্যে এই প্ল্যাটফর্মে
        অন্তর্ভুক্ত হয়ে থাকলে 'Sign In' করুন।
      </p>
    </>
  );
};

export default SignInForm;
