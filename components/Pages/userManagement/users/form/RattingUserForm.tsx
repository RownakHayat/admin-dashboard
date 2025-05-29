import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import FormInput from "@/components/common/Form/FormInput";
import Swal from "sweetalert2";
import { useRatingUpdateMutation } from "@/store/features/UserManagement/Users";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

const UserRatingSchema = z.object({
  id: z.number().nullable(),
  rating: z.number().min(1).max(5).int(),
});

interface UserRatingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof UserRatingSchema>) => void;
  initialValues?: any;
  selectedUser?: any;
}

const UserRatingModal: React.FC<UserRatingDialogProps> = ({open,onClose,onSave, initialValues, selectedUser,}) => {
  const [createUsersRating] = useRatingUpdateMutation();
  const router = useRouter();
  const [currentRating, setCurrentRating] = useState<number>(0);

  const form = useForm<z.infer<typeof UserRatingSchema>>({
    resolver: zodResolver(UserRatingSchema),
    defaultValues: {
      id: initialValues?.id || null,
      rating: initialValues?.rating || 0,
    },
  });

  useEffect(() => {
    if (selectedUser) {
      const previousRating = Number(selectedUser?.user_profile?.rating) || 0;
      setCurrentRating(previousRating);
      form.reset({
        id: initialValues?.id || null,
        rating: previousRating,
      });
    }
  }, [form, initialValues, selectedUser]);


  const onSubmitHandler: SubmitHandler<z.infer<typeof UserRatingSchema>> = async (values) => {
    const data = { ...values, rating: currentRating };
    try {
      const res = await createUsersRating(data).unwrap();

      if (res.code === 200) {
        form.reset();
        onClose();
        Swal.fire({
          title: "Success!",
          text: "Rating Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#0b9e45",
        }).then(() => {
          router.push(`/admin/user-management/users`);
        });
      }
    } catch (err) {
      console.error("Error saving rating:", err);
    }
  };

  // Handle star click event
  const handleStarClick = (rating: number) => {
    setCurrentRating(rating);
    form.setValue("rating", rating);
  };

  return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Rate User</DialogTitle>
          <DialogDescription>
            Please provide a rating for this user
          </DialogDescription>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)}>
              {/* Hidden Input for ID */}
              <FormInput name="id" label="" className="hidden" />
              <FormInput
                  name="user_name"
                  label="User Name"
                  value={initialValues?.name}
                  disabled
              />

              <div className="flex gap-1 justify-center mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`cursor-pointer ${
                            star <= currentRating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill={star <= currentRating ? "yellow" : "none"}
                    />
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                    type="button"
                    onClick={onClose}
                    className="bg-warning hover:bg-warning xl:px-8 lg:px-6 md:px-6 sm:px-7"
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-success hover:bg-success xl:px-8 lg:px-6 md:px-6 sm:px-7"
                >
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
};

export default UserRatingModal;
