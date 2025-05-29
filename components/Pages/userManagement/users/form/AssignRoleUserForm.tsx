import { FormAutoComplete } from "@/components/common/Form/FormAutoComplete";
import FormInput from "@/components/common/Form/FormInput";
import { listArrayDaynamicModify } from "@/components/common/lib/globalFunction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAllActiveUsersRollQuery, useUserStaffRoleAssignPermissionMutation } from "@/store/features/UserManagement/Roll";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import { UsersRollSchema } from "../schemas/userCreateSchema";

interface StaffRollDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof UsersRollSchema>) => void;
  initialValues?: any;
}

const CreateAssignUserRoleForm: React.FC<StaffRollDialogProps> = ({
  open,
  onClose,
  onSave,
  initialValues,
}) => {
  const { data: userRoleData } = useGetAllActiveUsersRollQuery();
  const [createStaffUsersRole] = useUserStaffRoleAssignPermissionMutation();
  const router = useRouter()
  const number: number = initialValues?.id;
  const form = useForm<z.infer<typeof UsersRollSchema>>({
    resolver: zodResolver(UsersRollSchema),
    defaultValues: {
      id: initialValues?.name || "",
      roles_id: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...initialValues,
        roles_id: initialValues?.role?.id?.toString()
      });
    }
  }, [form, initialValues]);



  const onSubmitHandler: SubmitHandler<
    z.infer<typeof UsersRollSchema>
  > = async (values) => {
    //  const rolesIdArray = Array.isArray(values.roles_id) ? values.roles_id : [values.roles_id];
    try {
      const mutationFn = createStaffUsersRole;
      const rolesIdArray = Array.isArray(values.roles_id) ? values.roles_id : [values.roles_id];
      const updatedValues = { id: values?.id, roles_id: rolesIdArray };
      const res = await mutationFn(updatedValues).unwrap();
      if (res.code === 200) {
        await form.reset();
        onClose();
        Swal.fire({
          title: 'Success!',
          text: "Role Updated Successfully",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0b9e45'

        }).then(() => {
          router.push("/admin/user-management/users");
        });

      }
    } catch (err: any) {
      if (err?.data?.errors) {
        err?.data?.errors?.forEach(
          ({ field, message }: { field: string; message: string }) =>
            form.setError(field as keyof z.infer<typeof UsersRollSchema>, {
              type: "custom",
              message,
            })
        );
      } else { }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle>Assign Role to User</DialogTitle>
        <DialogDescription>
          Please assign the role
        </DialogDescription>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)}>
            <FormInput name="id" label="" className="hidden" />
            <FormInput name="name" label="User Name" disabled />

            <FormAutoComplete
              name="roles_id"
              data={listArrayDaynamicModify(userRoleData?.data?.data, "roles", "name")}
              singleListName="roles"
              label="Select Role"
              placeholder="Select Role"
              control={form.control}
              remark={true}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button type="button" onClick={onClose} className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5">
                Cancel
              </Button>
              <Button type="submit" className="bg-success hover:bg-success xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5">
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignUserRoleForm;
