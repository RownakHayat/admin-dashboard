import FormContainer from '@/components/common/Form/FormContainer';
import FormInput from '@/components/common/Form/FormInput';
import { useFormSetting } from '@/components/common/hooks/useFormSetting';
import useToast from '@/components/common/hooks/useToast';
import { Button } from '@/components/ui/button';
import { useBudgetTimeUpdateMutation, useCreateBudgetTimeMutation } from '@/store/features/configuration/budgetItem';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { budgetItemsSchema } from '../schemas/budgetItemsSchema';
import { useRouter } from 'next/navigation';

type BudgetItemFormProps = {
    refetch: () => void;
};

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({ refetch }) => {
    const { showData, editMode, closeFormToggle } = useFormSetting();
    const { ToastSuccess, ToastError } = useToast();
    const [createUpazila] = useCreateBudgetTimeMutation();
    const [updateUpazila] = useBudgetTimeUpdateMutation();
    const router = useRouter();
    const form = useForm<z.infer<typeof budgetItemsSchema>>({
        resolver: zodResolver(budgetItemsSchema),
        defaultValues: {
            name: '',
            unit: '',
        },
    });
    const onCancelClick = () => {
        router.back();
      };
    const onSubmit: SubmitHandler<z.infer<typeof budgetItemsSchema>> = async (values) => {
        try {
            const mutationFn = editMode ? updateUpazila : createUpazila;
            const res = await mutationFn({
                ...values,
                status: editMode ? showData?.status : 1,
                id: showData?.id,
            }).unwrap();
            if (res.code === 200) {
                form.reset();
                refetch();
                ToastSuccess(editMode ? 'Updated Successfully' : 'Created Successfully');
                if (editMode) closeFormToggle();
            }
        } catch (err: any) {
            err?.data?.errors?.forEach(({ field, message }: { field: string; message: string }) =>
                form.setError(field as keyof z.infer<typeof budgetItemsSchema>, {
                    type: 'custom',
                    message,
                })
            );
            ToastError(`Failed to ${editMode ? 'Update' : 'Create'}`);
        }
    };

    useEffect(() => {
        form.reset({
            ...showData,
            name: showData?.name || '',
            unit: showData?.unit || '',
        });
    }, [showData, editMode, form]);

    useEffect(() => () => closeFormToggle(), [closeFormToggle]);

    return (
        <div className="w-full bg-[#f5f3fa] rounded my-3">
            <div className="bg-headerbg p-5 mb-3">
                <p className="text-2xl">{editMode ? 'Update' : 'Create'} Budget Item</p>
            </div>
            <div className="py-5 mx-2">
                <FormContainer form={form} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-2 mt-0 items-center">
                        <div className="col-span-12 md:col-span-6">
                            <FormInput
                                name="name"
                                placeholder="Enter Budget Item"
                                label="Name"
                                remark={true}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <FormInput
                                name="unit"
                                placeholder="Enter Budget Unit"
                                label="Unit"
                                remark={true}
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

export default BudgetItemForm;
