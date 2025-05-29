import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete';
import FormContainer from '@/components/common/Form/FormContainer';
import FormInput from '@/components/common/Form/FormInput';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import useToast from '@/components/common/hooks/useToast';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useActivitiesUpdateMutation, useCreateActivitiesMutation } from '@/store/features/configuration/activities';
import { useGetAllActivityCategoryQuery } from '@/store/features/configuration/activityCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { activitiesSchema } from '../schemas/activitiesSchema';
import { useRouter } from 'next/navigation';

type ActivitiesFormProps = {
    refetch: () => void;
};

const ActivitiesForm: React.FC<ActivitiesFormProps> = ({ refetch }) => {
    const { showData, editMode, closeFormToggle } = useFormSetting();
    const { ToastSuccess, ToastError } = useToast();
    const [createActivity] = useCreateActivitiesMutation();
    const [updateActivity] = useActivitiesUpdateMutation();
    const router = useRouter();
    const { data: allActivityCategory } = useGetAllActivityCategoryQuery();
    const form = useForm<z.infer<typeof activitiesSchema>>({
        resolver: zodResolver(activitiesSchema),
        defaultValues: {
            name: '',
            name_bn: '',
            priority_no: '',
            activity_category_id: '',
        },
    });
    

    const onSubmit: SubmitHandler<z.infer<typeof activitiesSchema>> = async (values) => {
        try {
            const mutationFn = editMode ? updateActivity : createActivity;
            const res = await mutationFn({
                ...values,
                status: editMode ? showData?.status : 1,
                id: showData?.id,
                name_bn: values?.name_bn ? values?.name_bn : "",
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
                form.setError(field as keyof z.infer<typeof activitiesSchema>, {
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
    

    useEffect(() => {
        form.reset({
            ...showData,
            name: showData?.name || '',
            name_bn: showData?.name_bn || '',
            priority_no: showData?.priority_no || '',
            activity_category_id: showData?.activity_category_id?.toString() || '',
        });
    }, [showData, editMode, form]);

    useEffect(() => () => closeFormToggle(), [closeFormToggle]);

    return (
        <div className="w-full bg-[#f5f3fa] rounded my-3">
            <div className="bg-headerbg p-5 mb-3">
                <p className="text-2xl">{editMode ? 'Update' : 'Create'} Activity</p>
            </div>
            <div className="py-5 mx-2">
                <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-2 mt-0 items-center">
                        <div className="col-span-12 md:col-span-4">
                            <FormAutoComplete
                                name="activity_category_id"
                                data={listArrayDaynamicModify(allActivityCategory?.data, "activity_category", "name")}
                                singleListName="activity_category"
                                label="Activity Category"
                                placeholder="Select Activity Category"
                                remark={true}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <FormInput
                                name="name"
                                placeholder="Enter Activity"
                                label="Activity Name (English)"
                                remark={true}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <FormInput
                                name="name_bn"
                                placeholder="Enter Activity"
                                label="Activity Name (Bangla)"
                                bengaliAllow={true}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-12 mt-10">
                            <div className="flex justify-end gap-5">
                                {editMode ? (
                                    <Button
                                        type="button"
                                        className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
                                        onClick={onCancelClick}
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
                    </div>
                </FormContainer>
            </div>
        </div>
    );
};

export default ActivitiesForm;
