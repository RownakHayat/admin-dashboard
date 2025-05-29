import { FormAutoComplete } from '@/components/common/Form/FormAutoComplete';
import FormContainer from '@/components/common/Form/FormContainer';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import useToast from '@/components/common/hooks/useToast';
import { listArrayDaynamicModify } from '@/components/common/lib/globalFunction';
import { Button } from '@/components/ui/button';
import { useGetAllActivityCategoryQuery } from '@/store/features/configuration/activityCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { chatbotSchema } from '../schemas/chatbotSchema';
import { FormAutoCompleteMultiSelect } from "@/components/common/Form/FormAutoCompleteMultiSelect";
import { useGetAllStaffUserQuery } from "@/store/features/UserManagement/staffUsers";
import { useCreateChatbotMutation } from "@/store/features/configuration/chatbot";

type ChatbotFormProps = {
    refetch: () => void;
};

const ChatbotForm: React.FC<ChatbotFormProps> = ({ refetch }) => {
    const { showData, editMode, closeFormToggle } = useFormSetting();
    const { ToastSuccess, ToastError } = useToast();
    const [createChatbot] = useCreateChatbotMutation();
    const { data: allActivityCategory } = useGetAllActivityCategoryQuery();
    const { data: staffDropdown } = useGetAllStaffUserQuery();
    const form = useForm<z.infer<typeof chatbotSchema>>({
        resolver: zodResolver(chatbotSchema),
        defaultValues: {
            activity_category_id: "",
            user_ids: [],
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof chatbotSchema>> = async (values) => {
        try {
            const mutationFn = editMode ? createChatbot : createChatbot;
            const res = await mutationFn({
                ...values,
                status: editMode ? showData?.status : 1,
                id: showData?.id,
                activity_category_id: values?.activity_category_id ? values?.activity_category_id : "",
            }).unwrap();
            if (res.code === 200) {
                closeFormToggle()
                form.reset();
                refetch();
                ToastSuccess(editMode ? 'Helpdesk Updated Successfully' : 'Helpdesk Created Successfully');
                if (!editMode) closeFormToggle();
            }
        } catch (err: any) {
            err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
                form.setError(field as keyof z.infer<typeof chatbotSchema>, {
                    type: 'custom',
                    message,
                })
            );
            ToastError(`Failed to ${editMode ? 'Update' : 'Create'}`);
        }
    };

    useEffect(() => {

        const userIds =
            showData?.assigned_staffs?.map((staff: any) =>
                staff?.user_id.toString()
            ) || [];

        form.reset({
            ...showData,
            activity_category_id: showData?.id?.toString() || '',
            user_ids: userIds,
        });
    }, [showData, editMode, form]);

    useEffect(() => () => closeFormToggle(), [closeFormToggle]);

    return (
        <div className="w-full bg-[#f5f3fa] rounded my-3">
            <div className="bg-headerbg p-5 mb-3">
                {/* <p className="text-2xl">{editMode ? 'Update' : 'Create'} Chatbot</p> */}
                <p className="text-2xl">Assign Officials to Helpdesk</p>
            </div>
            <div className="py-5 mx-2 items-center">
                <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-5 mt-0 items-center">
                        <div className="col-span-12 md:col-span-6">
                            <FormAutoComplete
                                name="activity_category_id"
                                data={listArrayDaynamicModify(allActivityCategory?.data, "activity_category_name", "name")}
                                singleListName="activity_category_name"
                                label="Activity Category"
                                placeholder="Select Activity Category"
                                remark={true}
                            />
                        </div>

                        <div className="col-span-12  md:col-span-6">
                        </div>
                        <div  className="col-span-12  md:col-span-6">
                        <FormAutoCompleteMultiSelect
                                name="user_ids"
                                data={listArrayDaynamicModify(
                                    staffDropdown?.data,
                                    "name",
                                    "name"
                                )}
                                singleListName="name"
                                label="SME Officials"
                                placeholder="Select"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-12 mt-10">
                            <div className="flex justify-end gap-5">
                                {editMode ? (
                                    <Button
                                        type="button"
                                        className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5"
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
                    </div>
                </FormContainer>
            </div>
        </div>
    );
};

export default ChatbotForm;
