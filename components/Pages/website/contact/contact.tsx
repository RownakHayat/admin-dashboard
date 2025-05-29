"use client";

import { useFormSetting } from "@/components/common/hooks/useFormSetting";
import { useGetHomeDataQuery } from "@/store/features/home";
import { useCreateUsersRollMutation, useUsersRollUpdateMutation } from "@/store/features/UserManagement/Roll";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { contactSchema } from "./schema/contactSchema";

const ContactComponent = () => {
  const { showData, editMode, closeFormToggle } = useFormSetting();
  const [createUserRoll] = useCreateUsersRollMutation();
  const [updateUserType] = useUsersRollUpdateMutation();
  const router = useRouter();

  const { data: listQuery, refetch, isLoading } = useGetHomeDataQuery();


  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof contactSchema>> = async (values) => {
    try {
      const mutationFn = editMode ? updateUserType : createUserRoll;
      const res = await mutationFn({
        ...values,
        status: editMode ? showData?.status : 1,
        id: showData?.id,
      }).unwrap();

      if (res.code === 200) {
        form.reset();
        closeFormToggle();
        Swal.fire({
          title: 'Success!',
          text: editMode ? "Updated Successfully" : "Created Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'
        }).then(() => {
          router.push("/admin/user-management/role");
        });
      }
    } catch (err: any) {
      err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
        form.setError(field as keyof z.infer<typeof contactSchema>, {
          type: "custom",
          message,
        })
      );
    }
  };

  useEffect(() => {
    if (showData) {
      form.reset({
        name: showData.name || "",
      });
    }
  }, [showData, form]);

  return (
    <div className="">
      <div className="flex justify-center py-10 px-8 bg-gradient-to-b from-headerbg to-[#FFFF]">
      <div className="py-[53px] ">
        <h5 className='sm:text-[5px] md:text-[20px] lg:text-[23px] xs:px-6 sm:px-10 font-bold'>{listQuery?.data?.site_info?.address_title}</h5>
        <p className='sm:text-[5px] md:text-[16px] lg:text-[18px] mt-5 xs:px-6 sm:px-10 text-opacity-90 '>{listQuery?.data?.site_info?.address_1}</p>
        <p className=' sm:text-[5px] md:text-[16px] lg:text-[18px] xs:px-6 sm:px-10 mt-2 space-y-3 text-opacity-85 '>পর্যটন ভবন (লেভেল: ৬-৭)
          <br />
          ই-৫/সি-১, আগারগাঁও প্রশাসনিক এলাকা, শের-ই-বাংলা নগর, ঢাকা-১২০৭, বাংলাদেশ
        </p>

        <h6 className='mt-5 sm:text-[5px] md:text-[16px] lg:text-[18px] xs:px-6 sm:px-10 text-opacity-90 '>{listQuery?.data?.site_info?.address_2}</h6>
        <p className='xs:px-6 sm:px-10 mt-2 sm:text-[5px] md:text-[16px] lg:text-[18px] text-opacity-85 '>জহির স্মার্ট টাওয়ার (৪র্থ তালা), ২০৫/১/এ, বেগম রোকেয়া সরণি, তালতলা, ঢাকা-১২০৭, বাংলাদেশ</p>
      </div>
    </div>
    </div>
    
  );
};

export default ContactComponent;
