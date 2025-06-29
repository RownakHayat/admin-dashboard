"use client"
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps {
    label?: string;
    placeholder?: any;
    type?: string;
    className?: string;
    style?: any;
    disabled?: boolean;
    remark?: boolean;
    bengaliAllow?: boolean;
    min?: any;
    max?: any;
    minlength?: any;
    maxlength?: any;
    pattern?: any;
    inputmode?: any;
    onChange?: any;
    value?: any;
    autoComplete?: string;
    defaultValue?: any;
}

type FormInputProps = {
    name: string;

} & InputFieldProps;

const FormInput: FC<FormInputProps> = ({
  name,
  className,
  value,
  remark,
  bengaliAllow = false,
  autoComplete = "off",
  ...otherProps
}) => {
  const form = useFormContext();
  const control = form?.control;
  const setValue = form?.setValue;
  const errors = form?.formState?.errors ?? {};
  const isInvalid = errors[name] !== undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^[^\u0980-\u09FF]*$/;

    if (regex.test(inputValue)) {
      setValue?.(name, inputValue); // only call if setValue exists
      otherProps.onChange?.(e);
    } else {
      alert("Please Type in English");
      setValue?.(name, "");
      e.target.value = "";
      otherProps.onChange?.({
        ...e,
        target: {
          ...e.target,
          value: "",
        },
      });
    }
  };

  if (!control) return null; // or show fallback

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col justify-between w-full">
          {otherProps.label && (
            <div className="basis-2/4">
              <Label className="text-[#4B5563]">
                {otherProps.label}
                {remark && <span className="text-red-500 pl-1">*</span>}
              </Label>
            </div>
          )}
          <div className={`${otherProps.label ? "basis-2/4" : ""} relative w-full`}>
            <FormControl className="m-0 p-0">
              <Input
                {...field}
                {...otherProps}
                value={value ?? field.value ?? ""}
                className={cn(
                  "bg-white border-[1px] rounded-md outline-none px-2",
                  isInvalid ? "border-red-500" : "border-[#cccccc]",
                  className
                )}
                onChange={bengaliAllow ? field.onChange : handleChange}
              />
            </FormControl>
            {isInvalid && (
              <FormMessage className="absolute-bottom-6 text-red-500 pt-2" />
            )}
          </div>
        </FormItem>
      )}
    />
  );
};


export default FormInput;
