import FormContainer from '@/components/common/Form/FormContainer';
import FormInput from '@/components/common/Form/FormInput';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import useToast from '@/components/common/hooks/useToast';
import { Button } from '@/components/ui/button';
import { useActivityCaregoryUpdateMutation, useCreateActivityCategoryMutation } from '@/store/features/configuration/activityCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchemas } from '../schemas/formSchemas';
import FormImageUpload from "@/components/common/Form/FormImageUpload";
import {siteConfig} from "@/config/site";
import { useRouter } from 'next/navigation';

type ActivitiesCategoryFormProps = {
    refetch: () => void;
};

const ActivitiesCategoryForm: React.FC<ActivitiesCategoryFormProps> = ({ refetch }) => {
    const { showData, editMode, closeFormToggle } = useFormSetting();
    const { ToastSuccess, ToastError } = useToast();
    const [createActivityCategory] = useCreateActivityCategoryMutation();
    const [updateActivityCategory] = useActivityCaregoryUpdateMutation();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchemas>>({
        resolver: zodResolver(formSchemas),
        defaultValues: {
            name: "",
            name_bn: "",
            banner: "",
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchemas>> = async (values) => {
        try {
            const mutationFn = editMode ? updateActivityCategory : createActivityCategory;
            const banner = editMode && (!values.banner || !values.banner.startsWith('data:'))
                ? showData?.banner
                : values.banner;
            const res = await mutationFn({
                ...values,
                status: editMode ? showData?.status : 1,
                id: showData?.id,
                name_bn: values?.name_bn ? values?.name_bn : "",
                banner,
            }).unwrap();
            if (res.code === 200) {
                closeFormToggle()
                form.reset();
                refetch();
                ToastSuccess(editMode ? 'Updated Successfully' : 'Created Successfully');
                if (!editMode) closeFormToggle();
            }
        } catch (err: any) {
            err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
                form.setError(field as keyof z.infer<typeof formSchemas>, {
                    type: 'custom',
                    message,
                })
            );
            ToastError(`Failed to ${editMode ? 'Update' : 'Create'}`);
        }
    };

    const onCancelClick = () => {
        router.back();
      };

    // const handleBanglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const banglaRegex = /^[\u0980-\u09FF\s]*$/;
    //     if (banglaRegex.test(e.target.value)) {
    //         form.setValue('name_bn', e.target.value);
    //     }
    // };

    useEffect(() => {
        form.reset({
            ...showData,
            name: showData?.name || '',
            name_bn: showData?.name_bn || '',
            banner: showData?.banner ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${showData?.banner}` : "",

        });
    }, [showData, editMode, form]);

    useEffect(() => () => closeFormToggle(), [closeFormToggle]);

    return (
        <div className="w-full bg-[#f5f3fa] rounded my-3">
            <div className="bg-headerbg p-5 mb-3">
                <p className="text-2xl">{editMode ? 'Update' : 'Create'} Helpdesk Category</p>
            </div>
            <div className="py-5 mx-2">
                <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-2 mt-0 items-center">
                        <div className="col-span-12 md:col-span-6 focus:mt-2 ">
                            <FormInput
                                name="name"
                                placeholder="Enter Activity Category"
                                label="Activity Category Name ( English )"
                                remark={true}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <FormInput
                                name="name_bn"
                                placeholder="Enter Activity Category Name Bangla"
                                label="Activity Category Name ( Bangla )"
                                bengaliAllow={true}
                            />
                        </div>
                    </div>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-8 lg:col-span-8">
                                <FormImageUpload name="banner" label="Banner" remark={false} />
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-12 mt-10">
                            <div className="flex justify-end gap-5">
                            {editMode ? (
                                    <Button
                                        type="button"
                                        className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                                        // onClick={onCancelClick}
                                        onClick={() => {
                                            closeFormToggle();
                                            form.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                                        onClick={() => {
                                            closeFormToggle();
                                            form.reset();
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}  
                                

                                <Button
                                    type="submit"
                                    className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                                >
                                    {editMode ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </div>

                </FormContainer>
            </div>
        </div>
    );
};

export default ActivitiesCategoryForm;
